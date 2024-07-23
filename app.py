from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# イベントデータのサンプル
events = [
    {"id": "1", "title": "サンプルイベント", "start": "2024-07-25T12:00:00Z", "end": "2024-07-25T13:00:00Z"}
]

@app.route('/events', methods=['GET'])
def get_events():
    return jsonify(events)

@app.route('/events', methods=['POST'])
def add_event():
    new_event = request.json
    new_event['id'] = str(len(events) + 1)  # 新しいIDを生成
    events.append(new_event)
    return jsonify(new_event), 201

@app.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    global events
    events = [event for event in events if event['id'] != event_id]
    return jsonify({'message': 'Event deleted successfully'}), 200

@app.route('/')
def serve_html():
    return send_from_directory('.', 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True)
