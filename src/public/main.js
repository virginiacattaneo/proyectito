var socket = io.connect("http://localhost:3000", { forceNew: true });



socket.on("messages", function (data) {
    console.log(data);
   // render(data);
  // document.getElementById("messages").innerHTML += `<p>
 //  <strong> ${data.Nombre.value}</strong>: ${data.Examen.value} 
 //  </p>`
  });
  
  
  /*function render(data) {
    var html = data.map(function (elem, index) {
        return `<div>
                <strong>${elem.author}</strong>:
                <em>${elem.text}</em>
              </div>`;
      })
      .join(" ");
  
    document.getElementById("messages").innerHTML = html;
  }*/
  
  
  function addMessage(e) {
    var mensaje = {
      Nombre: document.getElementById("username").value,
      //Examen: document.getElementById("texto").value,
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
            estado: "desconectado hace 3 segundos",
            alumno: document.getElementById("username").value,
          };
        
          socket.emit("new-message", message);   
        }
    
    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 8000)
        // 1000 milliseconds = 1 second
        }
    };
    
        