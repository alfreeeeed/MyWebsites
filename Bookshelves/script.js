
/*var plus_button = 0;
for (let i = 0; i < 50; i ++) {
  let div = document.createElement('div');
  div.className = 'book';
  div.id = "b1_"+[i]
  const element = document.getElementById("shelv1");
  element.appendChild(div);
}
*/
var max_count = 10;
var count = 0;
function neeew(){
  if(count<max_count){
    let div = document.createElement('div');
    div.className = 'book';
    div.id = "b1_"+[count];
    count++;
    let element = document.getElementById("shelv1");
    let bttn = document.getElementById("bttn1");
    element.insertBefore(div, bttn);
  }
  else{
    let bttn = document.getElementById("bttn1");
    bttn.remove()
    let div = document.createElement('div');
    div.className = 'book';
    div.id = "b1_"+[count];
    let element = document.getElementById("shelv1");
    element.appendChild(div);
    count= 0;
  }
}
