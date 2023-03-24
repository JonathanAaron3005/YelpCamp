const btn = document.querySelector("#deleteImgBtn");
const imgList = document.querySelector('#deleteImgList');

btn.addEventListener('click', (e) => {
    e.preventDefault();

    imgList.classList.toggle('d-none');
    
    if(btn.innerHTML === "Cancel"){
        btn.innerHTML = "Delete Some Images";
    } else {
        btn.innerHTML = "Cancel";
    }
})