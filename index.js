const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), options = []);
document.querySelector(".submitbtn").addEventListener("click", () => {
  let event_title = document.getElementById("event_title").value;
  let event_start_date = document.getElementById("event_start_date").value;
  let event_time = document.getElementById("event_time").value;
  let event_end_date = document.getElementById("event_end_date").value;
  let events_identifier = new Date().toISOString()
  let my_event_obj =
  {
    title: event_title,
    start_date: event_start_date,
    time: event_time,
    end_date: event_end_date,
    id: events_identifier
  }
  if (localStorage.getItem('event_data_list')) {
    let get_itme_list = localStorage.getItem("event_data_list");
    let json_parse_data = JSON.parse(get_itme_list);
    json_parse_data.push(my_event_obj);
    let json_data = JSON.stringify(json_parse_data)
    localStorage.setItem("event_data_list", json_data);
  }
  else {
    let json_data = JSON.stringify([my_event_obj])
    localStorage.setItem("event_data_list", json_data);
  }
  document.querySelector(".form_reset").reset();
  myModal.hide();
  location.reload();
})
let eventArray = [];
let loop_array_list = localStorage.getItem("event_data_list");
let json_loop_array_list_parse = JSON.parse(loop_array_list);
if (loop_array_list) {
  for (let i = 0; i < json_loop_array_list_parse.length; i++) {
    let obj = json_loop_array_list_parse[i];
    eventArray.push({
      'title': obj.title,
      'id': obj.id,
      'start': `${obj.start_date}T${obj.time}`,
      'end_date': obj.end_date,
      'extendedProps': {
        'id': obj.id,
      }
    });
  }
}
function delete_event(eve_id) {
  let getitem_frome_local_storage = localStorage.getItem("event_data_list");
  let getitem_frome_local_storage_parse = JSON.parse(getitem_frome_local_storage);
  let event_delete_array = [];
  for (let i = 0; i < getitem_frome_local_storage_parse.length; i++) {
    let item = getitem_frome_local_storage_parse[i];
    if (item.id == eve_id) {
      continue;
    }
    else {
      event_delete_array.push({
        'title': item.title,
        'id': item.id,
        'start': `${item.start_date}T${item.time}`,
        'end_date': item.end_date,
        'extendedProps': {
          'id': item.id,
        }
      })
    }
  }
  let stringify_array = JSON.stringify(event_delete_array);
  let promt = window.confirm("are you sure you want to delete this entries");
  if (promt) {
    let local = localStorage.setItem("event_data_list", stringify_array);
  }
  location.reload();
}
document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialDate: new Date(),
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
    select: function (arg) {
      myModal.toggle();
      document.getElementById("event_start_date").value = arg.startStr;
      calendar.unselect()
    },
    eventClick: function (arg) {
      let eve_id = arg.event.extendedProps.id;
      delete_event(eve_id);
    },
    editable: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: eventArray,
  });
  calendar.render();
});