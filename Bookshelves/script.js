
/*var plus_button = 0;
for (let i = 0; i < 50; i ++) {
  let div = document.createElement('div');
  div.className = 'book';
  div.id = "b1_"+[i]
  const element = document.getElementById("shelv1");
  element.appendChild(div);
}
*/
/*
function neeew(shelv){
  let div = document.createElement('div');
  div.className = 'book';
  div.id = [shelv]+'-'+[count];
  count++;
  let element = document.getElementById("shelv"+[shelv]);
  let bttn = document.getElementById("bttn"+[shelv]);
  element.insertBefore(div, bttn);
  if(count == max_count){
    let bttn = document.getElementById("bttn"+[shelv]);
    bttn.remove();
    count = 0;
  }
}
*/
var max_count = 11;
var count = 0;
var bttnstate = false;

function newshlv(uNummber){
  let nuNummber = uNummber - 1;
  if(count < max_count && bttnstate === true){
    count = 0;
    bttnstate = false;
    let bttn = document.getElementById("bttn"+[nuNummber]);
    bttn.remove();
  }
  //creates the oneshelv element
  let shelv = document.createElement('div');
  shelv.className = 'oneshelv';
  shelv.id = 'shelv'+[uNummber];
  //creates the newbook element
  bttnstate = true;
  let nbook = document.createElement('div');
  nbook.className = 'newbook book';
  nbook.id = 'bttn'+[uNummber];
  nbook.onclick = function (){
          let shelv = uNummber;
          let div = document.createElement('div');
          div.className = 'book';
          div.id = [shelv]+'-'+[count];
          count += 1;
          let element = document.getElementById("shelv"+[shelv]);
          let bttn = document.getElementById("bttn"+[shelv]);
          element.insertBefore(div, bttn);
          if(count == max_count){
            let bttn = document.getElementById("bttn"+[shelv]);
            bttn.remove();
            count ++;
            bttnstate = false;
          }
        }
  //cobines the elements an creates the final element
  shelv.appendChild(nbook);
  let element = document.getElementById('all');
  let lastElement = document.getElementById('shelvbttn'+[uNummber]);
  element.insertBefore(shelv, lastElement);
  //changes the newshelv element
  let nshelv = document.createElement('div');
  let nNummber = uNummber - 1 + 2;
  nshelv.setAttribute("onclick", "newshlv("+[nNummber]+")");
  nshelv.className = "oneshelv newshelv"
  nshelv.id = 'shelvbttn'+[nNummber];
  element.appendChild(nshelv);
  let oshelv = document.getElementById('shelvbttn'+[uNummber]);
  oshelv.remove();
}
