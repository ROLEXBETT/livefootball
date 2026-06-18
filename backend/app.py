from dotenv import load_dotenv
load_dotenv()
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import mysql.connector
import firebase_admin
from firebase_admin import credentials, messaging
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

# =========================
# CONFIG
# =========================

API_KEY = os.getenv("API_FOOTBALL_KEY")

HEADERS = {
    "x-apisports-key": API_KEY or ""
}

API_BASE_URL = "https://v3.football.api-sports.io"

WORLD_CUP_LEAGUE_ID = 1
WORLD_CUP_SEASON = 2026

cache = {}
DEFAULT_CACHE_DURATION = timedelta(hours=6)


# =========================
# FIREBASE
# =========================

if os.path.exists("serviceAccountKey.json"):
    cred = credentials.Certificate("serviceAccountKey.json")

    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
else:
    print("WARNING: serviceAccountKey.json not found. Firebase notifications disabled.")


# =========================
# DATABASE
# =========================

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        port=int(os.getenv("MYSQL_PORT", "3306"))
    )


# =========================
# API CACHE HELPER
# =========================

def get_cached_or_fetch(cache_key, url, params=None, cache_duration=DEFAULT_CACHE_DURATION):
    now = datetime.now()

    if cache_key in cache:
        cached_time = cache[cache_key]["time"]
        cached_data = cache[cache_key]["data"]

        if now - cached_time < cache_duration:
            print(f"Using cached data for {cache_key}")
            return cached_data

    print(f"Fetching fresh data for {cache_key}")

    response = requests.get(
        url,
        headers=HEADERS,
        params=params
    )

    data = response.json()

    errors = data.get("errors")

    if not errors:
        cache[cache_key] = {
            "time": now,
            "data": data
        }
    else:
        print(f"API error for {cache_key}: {errors}")

    return data


# =========================
# NOTIFICATIONS
# =========================

def send_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        token=token
    )

    response = messaging.send(message)

    return response


# =========================
# BASIC ROUTE
# =========================

@app.route("/")
def home():
    return {
        "message": "Football API running"
    }


# =========================
# LIVE / MATCHES
# =========================

@app.route("/api/live")
def live_matches():
    data = get_cached_or_fetch(
        "live_matches",
        "https://v3.football.api-sports.io/fixtures",
        {
            "live": "all"
        },
        cache_duration=timedelta(seconds=30)
    )

    return jsonify(data)


@app.route("/api/match/<match_id>")
def match_details(match_id):
    data = get_cached_or_fetch(
        f"match_details_{match_id}",
        "https://v3.football.api-sports.io/fixtures",
        {
            "id": match_id
        },
        cache_duration=timedelta(minutes=5)
    )

    return jsonify(data)


@app.route("/api/match-stats/<fixture_id>")
def match_stats(fixture_id):
    data = get_cached_or_fetch(
        f"match_stats_{fixture_id}",
        "https://v3.football.api-sports.io/fixtures/statistics",
        {
            "fixture": fixture_id
        },
        cache_duration=timedelta(minutes=10)
    )

    return jsonify(data)


@app.route("/api/h2h/<home>/<away>")
def h2h(home, away):
    data = get_cached_or_fetch(
        f"h2h_{home}_{away}",
        "https://v3.football.api-sports.io/fixtures/headtohead",
        {
            "h2h": f"{home}-{away}"
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


# =========================
# TEAMS / PLAYERS
# =========================

@app.route("/api/search/<team_name>")
def search_team(team_name):
    data = get_cached_or_fetch(
        f"search_team_{team_name}",
        "https://v3.football.api-sports.io/teams",
        {
            "search": team_name
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/team/<team_id>")
def team_details(team_id):
    data = get_cached_or_fetch(
        f"team_details_{team_id}",
        "https://v3.football.api-sports.io/teams",
        {
            "id": team_id
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/team-players/<team_id>")
def team_players(team_id):
    season = 2024

    data = get_cached_or_fetch(
        f"team_players_{team_id}_{season}",
        "https://v3.football.api-sports.io/players",
        {
            "team": team_id,
            "season": season
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/player/<player_id>")
def player_details(player_id):
    season = 2024

    data = get_cached_or_fetch(
        f"player_details_{player_id}_{season}",
        "https://v3.football.api-sports.io/players",
        {
            "id": player_id,
            "season": season
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


# =========================
# LEAGUE STANDINGS / SCORERS
# =========================

@app.route("/api/standings/<league_id>")
def standings(league_id):
    season = 2024

    data = get_cached_or_fetch(
        f"standings_{league_id}_{season}",
        "https://v3.football.api-sports.io/standings",
        {
            "league": league_id,
            "season": season
        },
        cache_duration=timedelta(hours=6)
    )

    return jsonify(data)


@app.route("/api/topscorers/<league_id>")
def top_scorers(league_id):
    season = 2024

    data = get_cached_or_fetch(
        f"topscorers_{league_id}_{season}",
        "https://v3.football.api-sports.io/players/topscorers",
        {
            "league": league_id,
            "season": season
        },
        cache_duration=timedelta(hours=6)
    )

    return jsonify(data)


# =========================
# WORLD CUP
# =========================

@app.route("/api/worldcup/teams")
def worldcup_teams():
    data = get_cached_or_fetch(
        f"worldcup_teams_{WORLD_CUP_SEASON}",
        "https://v3.football.api-sports.io/teams",
        {
            "league": WORLD_CUP_LEAGUE_ID,
            "season": WORLD_CUP_SEASON
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/worldcup/fixtures")
def worldcup_fixtures():
    data = get_cached_or_fetch(
        f"worldcup_fixtures_{WORLD_CUP_SEASON}",
        "https://v3.football.api-sports.io/fixtures",
        {
            "league": WORLD_CUP_LEAGUE_ID,
            "season": WORLD_CUP_SEASON
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/worldcup/standings")
def worldcup_standings():
    data = get_cached_or_fetch(
        f"worldcup_standings_{WORLD_CUP_SEASON}",
        "https://v3.football.api-sports.io/standings",
        {
            "league": WORLD_CUP_LEAGUE_ID,
            "season": WORLD_CUP_SEASON
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/worldcup/topscorers")
def worldcup_topscorers():
    data = get_cached_or_fetch(
        f"worldcup_topscorers_{WORLD_CUP_SEASON}",
        "https://v3.football.api-sports.io/players/topscorers",
        {
            "league": WORLD_CUP_LEAGUE_ID,
            "season": WORLD_CUP_SEASON
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/worldcup/squad/<team_id>")
def worldcup_squad(team_id):
    data = get_cached_or_fetch(
        f"worldcup_squad_{team_id}_{WORLD_CUP_SEASON}",
        "https://v3.football.api-sports.io/players/squads",
        {
            "team": team_id
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/worldcup/knockout")
def worldcup_knockout():
    data = get_cached_or_fetch(
        f"worldcup_knockout_{WORLD_CUP_SEASON}",
        "https://v3.football.api-sports.io/fixtures",
        {
            "league": WORLD_CUP_LEAGUE_ID,
            "season": WORLD_CUP_SEASON
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


@app.route("/api/worldcup/teamstats/<team_id>")
def team_stats(team_id):
    data = get_cached_or_fetch(
        f"worldcup_teamstats_{team_id}_{WORLD_CUP_SEASON}",
        "https://v3.football.api-sports.io/teams/statistics",
        {
            "league": WORLD_CUP_LEAGUE_ID,
            "season": WORLD_CUP_SEASON,
            "team": team_id
        },
        cache_duration=timedelta(hours=12)
    )

    return jsonify(data)


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

    return jsonify({
        "stadiums": stadiums
    })


# =========================
# FAVORITES
# =========================

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

    values = (
        data["team_id"],
        data["team_name"],
        data["team_logo"]
    )

    cursor.execute(sql, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Favorite Added"
    }


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

    cursor.execute(
        "DELETE FROM favorites WHERE team_id=%s",
        (team_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Deleted"
    }


# =========================
# SUBSCRIPTIONS
# =========================

@app.route("/api/subscribe", methods=["POST"])
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
            "message": "Already subscribed"
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
        "message": "Subscribed successfully"
    }


@app.route("/api/worldcup/follow", methods=["POST"])
def worldcup_follow():
    data = request.json

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id
        FROM worldcup_followers
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
            "message": "Already following this team"
        }

    cursor.execute(
        """
        INSERT INTO worldcup_followers
        (
            team_id,
            team_name,
            device_token
        )
        VALUES
        (
            %s,
            %s,
            %s
        )
        """,
        (
            data["team_id"],
            data["team_name"],
            data["device_token"]
        )
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "World Cup follow added"
    }


# =========================
# TEST NOTIFICATION
# =========================

@app.route("/api/test-notification")
def test_notification():
    token =  "fDWOl1DDG-JXN9ra-i9C5z:APA91bHFSYw22kC9CE50aoqWE0hP2SoHS_rlhGlrbY3v7Zl21sC8Y41-qmKRVege4zgUpawv7QcfO9FyEvr19S-QhArmhsfEb5FwGtRMR4TX0Q5pOQtQKgE"

    response = send_notification(
        token,
        "⚽ Football Live",
        "Firebase notification test successful!"
    )

    return {
        "success": True,
        "response": response
    }


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)