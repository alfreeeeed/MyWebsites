
var plus_button = 0;
for (let i = 0; i < 50; i ++) {
  let div = document.createElement('div');
  div.className = 'book';
  div.id = "b1_"+[i]
  const element = document.getElementById("shelv1");
  element.appendChild(div);
}

/*
var text = ["text1", "tex2", "text", "text4"];
for(let i = 0; i < 7; i += 1) {
    let div = document.createElement("div");
    div.className = "finalBlock";
    div.innerHTML = text[i];
    const element = document.getElementById("shelv1")
    element.appendChild(div);
}
*/
