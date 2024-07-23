document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var eventModal = document.getElementById('eventModal');
    var closeModal = document.getElementsByClassName('close')[0];
    var eventForm = document.getElementById('event-form');
    var deleteButton = document.createElement('button'); // 削除ボタン

    deleteButton.textContent = '削除';
    deleteButton.style.marginLeft = '10px';

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch('/events')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched events:', data); // デバッグ用にイベントデータを出力
                    successCallback(data);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    failureCallback(error);
                });
        },
        editable: true,
        selectable: true,
        eventClick: function(info) {
            // 削除ボタンの表示
            if (!info.event.removeButton) {
                info.el.appendChild(deleteButton);
                deleteButton.addEventListener('click', function() {
                    fetch(`/events/${info.event.id}`, {
                        method: 'DELETE'
                    }).then(response => response.json())
                      .then(() => {
                          info.event.remove();
                      }).catch(error => {
                          console.error('Error deleting event:', error);
                      });
                });
                info.event.removeButton = true; // ボタンの重複を防ぐ
            }
        },
        select: function(info) {
            eventModal.style.display = 'block';
            document.getElementById('event-date').textContent = info.startStr;
        }
    });

    calendar.render();

    closeModal.onclick = function() {
        eventModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == eventModal) {
            eventModal.style.display = 'none';
        }
    }

    eventForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var title = document.getElementById('title').value;
        var eventDate = document.getElementById('event-date').textContent;

        var eventData = {
            title: title,
            start: eventDate
        };

        fetch('/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        }).then(response => response.json())
          .then(data => {
              calendar.addEvent(data); // カレンダーにイベントを追加
              eventModal.style.display = 'none';
              eventForm.reset();
          }).catch(error => {
              console.error('Error adding event:', error);
          });
    });
});
