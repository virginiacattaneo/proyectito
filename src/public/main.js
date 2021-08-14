var socket = io.connect("http://localhost:3000", { forceNew: true });



socket.on("messages", function (data) {
    console.log(data);
  });

function addMessage(e) {
    var mensaje = {
      Nombre: document.getElementById("username").value,
    };
  
    socket.emit("new-message", mensaje);
    return false;
  }
  
   var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    
    function logout() {
        alert("Ha pasado un tiempo sin aportar al examen, se informa al profesor");
         //location.href = 'logout.html'
         var message = {
            estado: "desconectado hace 5 minutos",
            alumno: document.getElementById("username").value,
          };
          console.log(message);
          socket.emit("new-message", message);   
        }
    
    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 300000)
         }
    };
    
        
