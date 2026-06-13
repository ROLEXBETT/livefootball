import time
import requests
import mysql.connector
from firebase_admin import messaging

API_KEY = "af5e9db0bef8b34a4eff99bc3c1941ca"

HEADERS = {
    "x-apisports-key": API_KEY
}

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="football_app"
)

cursor = db.cursor(dictionary=True)


def send_notification(token, title, body):

    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        token=token
    )

    messaging.send(message)


while True:

    try:

        response = requests.get(
            "https://v3.football.api-sports.io/fixtures?live=all",
            headers=HEADERS
        )

        matches = response.json()["response"]

        for match in matches:

            fixture_id = match["fixture"]["id"]

            home_team_id = match["teams"]["home"]["id"]
            away_team_id = match["teams"]["away"]["id"]

            home_team = match["teams"]["home"]["name"]
            away_team = match["teams"]["away"]["name"]

            home_goals = match["goals"]["home"] or 0
            away_goals = match["goals"]["away"] or 0

            cursor.execute(
                """
                SELECT *
                FROM live_scores
                WHERE fixture_id=%s
                """,
                (fixture_id,)
            )

            old_score = cursor.fetchone()

            if old_score:

                if (
                    home_goals > old_score["home_goals"]
                    or
                    away_goals > old_score["away_goals"]
                ):

                    score_text = (
                        f"{home_team} "
                        f"{home_goals}-{away_goals} "
                        f"{away_team}"
                    )

                    # Notify home followers
                    cursor.execute(
                        """
                        SELECT device_token
                        FROM subscriptions
                        WHERE team_id=%s
                        """,
                        (home_team_id,)
                    )

                    followers = cursor.fetchall()

                    for follower in followers:

                        send_notification(
                            follower["device_token"],
                            "⚽ GOAL!",
                            score_text
                        )

                    # Notify away followers
                    cursor.execute(
                        """
                        SELECT device_token
                        FROM subscriptions
                        WHERE team_id=%s
                        """,
                        (away_team_id,)
                    )

                    followers = cursor.fetchall()

                    for follower in followers:

                        send_notification(
                            follower["device_token"],
                            "⚽ GOAL!",
                            score_text
                        )

                cursor.execute(
                    """
                    UPDATE live_scores
                    SET home_goals=%s,
                        away_goals=%s
                    WHERE fixture_id=%s
                    """,
                    (
                        home_goals,
                        away_goals,
                        fixture_id
                    )
                )

            else:

                cursor.execute(
                    """
                    INSERT INTO live_scores
                    (
                        fixture_id,
                        home_goals,
                        away_goals
                    )
                    VALUES
                    (%s,%s,%s)
                    """,
                    (
                        fixture_id,
                        home_goals,
                        away_goals
                    )
                )

            db.commit()

        time.sleep(60)

    except Exception as e:

        print(e)

        time.sleep(60)
