from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import mysql.connector
import firebase_admin
from firebase_admin import credentials, messaging

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate(
    "serviceAccountKey.json"
)

firebase_admin.initialize_app(cred)

# 1. Updated for alwaysdata MySQL credentials
def get_db_connection():
    return mysql.connector.connect(
        host="mysql-rolexbett.alwaysdata.net",
        user="rolexbett",       
        password="modcom1234",   
        database="rolexbett_football",
        port=3306
    )

API_KEY = "284126ee84e225b11d0bbd882bdf17ef"

HEADERS = {
    "x-apisports-key": API_KEY
}

# Function to send FCM notification
def send_notification(
    token,
    title,
    body
):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        token=token
    )

    response = messaging.send(message)

    return response

@app.route("/")
def home():
    return {"message": "Football API running"}

@app.route("/api/live")
def live_matches():
    url = "https://v3.football.api-sports.io/fixtures?live=all"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

@app.route("/api/match/<match_id>")
def match_details(match_id):
    url = f"https://v3.football.api-sports.io/fixtures?id={match_id}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

@app.route("/api/search/<team_name>")
def search_team(team_name):
    url = f"https://v3.football.api-sports.io/teams?search={team_name}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

@app.route("/api/team/<team_id>")
def team_details(team_id):
    url = f"https://v3.football.api-sports.io/teams?id={team_id}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

@app.route("/api/standings/<league_id>")
def standings(league_id):
    season = 2024
    url = f"https://v3.football.api-sports.io/standings?league={league_id}&season={season}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

@app.route("/api/topscorers/<league_id>")
def top_scorers(league_id):
    season = 2024
    url = "https://v3.football.api-sports.io/players/topscorers"
    params = {
        "league": league_id,
        "season": season,
    }
    response = requests.get(url, headers=HEADERS, params=params)
    return jsonify(response.json())

@app.route("/api/player/<player_id>")
def player_details(player_id):
    season = 2024
    url = f"https://v3.football.api-sports.io/players?id={player_id}&season={season}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

@app.route("/api/team-players/<team_id>")
def team_players(team_id):
    season = 2024
    url = f"https://v3.football.api-sports.io/players?team={team_id}&season={season}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())


# 2. Dynamic connection handling inside routes
@app.route("/api/favorites", methods=["POST"])
def add_favorite():
    data = request.json
    
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    sql = """
    INSERT INTO favorites 
    (team_id, team_name, team_logo) 
    VALUES (%s, %s, %s)
    """
    values = (data["team_id"], data["team_name"], data["team_logo"])
    
    cursor.execute(sql, values)
    db.commit()
    
    cursor.close()
    db.close()
    
    return {"message": "Favorite Added"}

@app.route("/api/favorites")
def get_favorites():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM favorites")
    favorites = cursor.fetchall()
    
    cursor.close()
    db.close()
    
    return jsonify(favorites)

@app.route("/api/favorites/<team_id>", methods=["DELETE"])
def delete_favorite(team_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("DELETE FROM favorites WHERE team_id=%s", (team_id,))
    db.commit()
    
    cursor.close()
    db.close()
    
    return {"message": "Deleted"}


@app.route(
    "/api/subscribe",
    methods=["POST"]
)
def subscribe():

    data = request.json

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id
        FROM subscriptions
        WHERE team_id=%s
        AND device_token=%s
        """,
        (
            data["team_id"],
            data["device_token"]
        )
    )

    existing = cursor.fetchone()

    if existing:

        cursor.close()
        db.close()

        return {
            "message":
            "Already subscribed"
        }

    cursor.execute(
        """
        INSERT INTO subscriptions
        (
            team_id,
            device_token
        )
        VALUES
        (
            %s,
            %s
        )
        """,
        (
            data["team_id"],
            data["device_token"]
        )
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message":
        "Subscribed successfully"
    }


@app.route("/api/match-stats/<fixture_id>")
def match_stats(fixture_id):

    url = (
        f"https://v3.football.api-sports.io/"
        f"fixtures/statistics?fixture={fixture_id}"
    )

    response = requests.get(
        url,
        headers=HEADERS
    )

    return jsonify(response.json())


@app.route(
    "/api/h2h/<home>/<away>"
)
def h2h(home, away):

    url = (
        f"https://v3.football.api-sports.io/"
        f"fixtures/headtohead?"
        f"h2h={home}-{away}"
    )

    response = requests.get(
        url,
        headers=HEADERS
    )

    return jsonify(
        response.json()
    )


@app.route("/api/worldcup/fixtures")
def worldcup_fixtures():
    url = "https://v3.football.api-sports.io/fixtures"
    params = {
        "league": 1,
        "season": 2022,
    }
    response = requests.get(url, headers=HEADERS, params=params)
    return jsonify(response.json())


@app.route("/api/worldcup/standings")
def worldcup_standings():
    url = "https://v3.football.api-sports.io/standings"
    params = {
        "league": 1,
        "season": 2022,
    }
    response = requests.get(url, headers=HEADERS, params=params)
    return jsonify(response.json())


@app.route("/api/worldcup/topscorers")
def worldcup_topscorers():
    url = "https://v3.football.api-sports.io/players/topscorers"
    params = {
        "league": 1,
        "season": 2022,
    }
    response = requests.get(url, headers=HEADERS, params=params)
    return jsonify(response.json())


@app.route("/api/worldcup/squad/<team_id>")
def worldcup_squad(team_id):
    url = "https://v3.football.api-sports.io/players/squads"
    params = {"team": team_id}
    response = requests.get(url, headers=HEADERS, params=params)
    return jsonify(response.json())


@app.route("/api/worldcup/knockout")
def worldcup_knockout():
    url = "https://v3.football.api-sports.io/fixtures"
    params = {
        "league": 1,
        "season": 2022,
    }
    response = requests.get(url, headers=HEADERS, params=params)
    return jsonify(response.json())


@app.route("/api/worldcup/stadiums")
def worldcup_stadiums():
    stadiums = [
        {
            "name": "Lusail Stadium",
            "city": "Lusail",
            "capacity": 88966,
            "image": "https://images.pexels.com/photos/13638722/pexels-photo-13638722.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
        {
            "name": "Al Bayt Stadium",
            "city": "Al Khor",
            "capacity": 68895,
            "image": "https://images.pexels.com/photos/460841/pexels-photo-460841.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
    ]
    return {"stadiums": stadiums}


@app.route("/api/worldcup/teamstats/<team_id>")
def team_stats(team_id):
    url = "https://v3.football.api-sports.io/teams/statistics"
    params = {
        "league": 1,
        "season": 2022,
        "team": team_id,
    }
    response = requests.get(url, headers=HEADERS, params=params)
    return jsonify(response.json())


@app.route("/api/worldcup/follow", methods=["POST"])
def worldcup_follow():
    data = request.json
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT id FROM worldcup_followers WHERE team_id=%s AND device_token=%s",
        (data["team_id"], data["device_token"]),
    )
    existing = cursor.fetchone()

    if existing:
        cursor.close()
        db.close()
        return {"message": "Already following this team"}

    cursor.execute(
        "INSERT INTO worldcup_followers (team_id, team_name, device_token) VALUES (%s, %s, %s)",
        (data["team_id"], data["team_name"], data["device_token"]),
    )
    db.commit()
    cursor.close()
    db.close()

    return {"message": "World Cup follow added"}


@app.route("/api/test-notification")
def test_notification():
    token = "fDWOl1DDG-JXN9ra-i9C5z:APA91bHFSYw22kC9CE50aoqWE0hP2SoHS_rlhGlrbY3v7Zl21sC8Y41-qmKRVege4zgUpawv7QcfO9FyEvr19S-QhArmhsfEb5FwGtRMR4TX0Q5pOQtQKgE"

    response = send_notification(
        token,
        "⚽ Football Live",
        "Firebase notification test successful!"
    )

    return {
        "success": True,
        "response": response
    }


if __name__ == "__main__":
    app.run(debug=True, port=5000)
