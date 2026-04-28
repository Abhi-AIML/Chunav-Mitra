import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'election_info.json')

def load_election_data():
    with open(DATA_PATH, 'r') as f:
        return json.load(f)

def get_phase_info(phase_number: int):
    data = load_election_data()
    for p in data.get("phases", []):
        if p["phase"] == phase_number:
            return p
    return None

def get_all_phases():
    data = load_election_data()
    return data.get("phases", [])

def get_results_date():
    data = load_election_data()
    return data.get("results_date", "TBD")
