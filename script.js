const tvSelect = document.querySelector('.tv');
const movieSelect = document.querySelector('.movie');
const inputField = document.querySelector('[input-field]');
const inputForm = document.querySelector('[input-form]');
const dropdownList = document.getElementById('dropdownList');
let currentTab = tvSelect;
tvSelect.classList.add('select-tab');
function goToTab(tab){
    if(tab!=currentTab){
        // currentTab = tab;
        currentTab.classList.remove('select-tab');
        currentTab = tab;
        currentTab.classList.add('select-tab');
    }
}
tvSelect.addEventListener('click', () => {
    goToTab(tvSelect);
})
movieSelect.addEventListener('click', () => {
    goToTab(movieSelect);
})
inputField.addEventListener('input', async () => {
    let inputValue = inputField.value.toLowerCase();
    let url1 = `https://api.jikan.moe/v4/anime?q=${inputValue}&sfw`;
    let response1 = await fetch(url1);
    let received1 = await response1.json();
    let filteredOptions = [];
    // received1?.data.forEach((item) => options.push(item?.titles?.[0]?.title));
    for (let index = 0; index < 7; index++) {
        if(received1?.data?.[index]?.titles?.[0]?.title){
            filteredOptions.push(received1?.data?.[index]?.titles?.[0]?.title);
        }
    }
    dropdownList.innerHTML = '';
    
    // Populate the dropdown with filtered options
    filteredOptions.forEach(option => {
        const listItem = document.createElement('li');
        listItem.textContent = option;
        listItem.addEventListener('click', function() {
            inputField.value = option;
            dropdownList.style.display = 'none';
        });
        dropdownList.appendChild(listItem);
    });
    if (filteredOptions.length > 0) {
        dropdownList.style.display = 'block';
    } else {
        dropdownList.style.display = 'none';
    }
    console.log(filteredOptions);
})
document.addEventListener('click', function(event) {
    if (event.target !== inputField && event.target !== dropdownList) {
        dropdownList.style.display = 'none';
    }
});


// var countage = 0;
const coverImg = document.querySelector('[cover-image]');
const trailerLink = document.querySelector('[trailer-link]');
const animeDesc = document.querySelector('[anime-description]');
const rating = document.querySelector('.rating');
const rank = document.querySelector('.rank');
const duration = document.querySelector('.duration');
const nameOfAnime = document.querySelector('.title');

function isThere(someItem){
    if(someItem){
        return someItem;
    }
    else{
        return 'N/A';
    }
}

function trailerPrint(stuff, ind){
    trailerLink.setAttribute('style', 'z-index: 100');
    if(stuff?.data?.[ind]?.trailer?.url == null){
        trailerLink.href = '#';
        trailerLink.textContent = 'Trailer Not Found';
        trailerLink.classList.add('not-found');
    }
    else{
        trailerLink.textContent = 'Trailer';
        trailerLink.href = stuff?.data?.[ind]?.trailer?.url;
        trailerLink.classList.remove('not-found');
    }
}

function descriptionPrint(stuff, ind){
    let dt = stuff?.data?.[ind]?.synopsis;
    let newdt = dt.slice(0,250);
    // for(let i = 250; i<dt.length;i++){
    let i = 250;
    while(i<dt.length){
        if(dt[i]!=' '){
            newdt+=dt[i];
        }
        else{
            break;
        }
        i++;
    }
    if(i<dt.length){
        animeDesc.innerHTML = newdt+'... <span style="color: blue; cursor:pointer;">Read More</span>'; 
    }
    else{
        animeDesc.innerHTML = newdt;
    }
    
}

/*const container = document.getElementById("wrapper");
const spark = document.getElementById("spark");

container.addEventListener("click", function (event) {
    // Get the mouse click coordinates
    const x = event.clientX;
    const y = event.clientY;

    // Set the spark's position
    spark.style.left = x + "px";
    spark.style.top = y + "px";

    // Show the spark and then hide it after a short delay
    spark.style.display = "inline";
    setTimeout(() => {
        spark.style.display = "none";
    }, 100); // You can adjust the delay as needed
});*/



function detailPrint(stuff, ind){
    document.querySelector('.rating').innerHTML ='<span style="font-weight: 700">Rating:</span>'+ isThere(stuff?.data?.[ind]?.score);
    document.querySelector('.year').innerHTML ='<span style="font-weight: 700">Year:</span>'+ isThere(stuff?.data?.[ind]?.year);
    document.querySelector('.duration').innerHTML ='<span style="font-weight: 700">Duration:</span>'+ isThere(stuff?.data?.[ind]?.duration);

}
async function renderWith(stuff){
    coverImg.setAttribute('style', 'z-index:100');
    coverImg.src = stuff?.data?.[0]?.images?.webp?.image_url;
    console.log(stuff?.data?.[0]?.trailer?.url);
    trailerPrint(stuff, 0);
    
    nameOfAnime.textContent = stuff?.data?.[0]?.titles?.[0]?.title;
    // let arr = stuff?.data?.[0]?.synopsis;
    // arr = arr.split(' ');
    
    // animeDesc.innerHTML = arr.slice(0,31).join(' ');
    descriptionPrint(stuff, 0);
    detailPrint(stuff, 0);
    let countage = 1;
    let totalPresent = stuff?.pagination?.items?.count;
    console.log('Total: ',totalPresent);
    while(countage <= Math.min(totalPresent,10)){
        console.log('countage count: ', countage);
        // try{
        document.querySelector(`#card-${countage}`).setAttribute('style', 'z-index: 20');
        // }
        // catch(e){
            // console.log('shit');
        // }
        
        let cardImg = document.getElementById(`${countage}-card-img`);
        let titleDiv = document.querySelector(`#title-${countage}`);
        cardImg.src = stuff?.data?.[countage-1]?.images?.webp?.image_url;
        titleDiv.textContent = stuff?.data?.[countage-1]?.titles?.[0]?.title;
        countage++;
    }
    console.log('countage:',countage);
    if(countage<10){
         while(countage <= 10){
                await document.querySelector(`#card-${countage}`).setAttribute('style', 'z-index: -90');
                let cardImg = document.getElementById(`${countage}-card-img`);
                let titleDiv = document.querySelector(`#title-${countage}`);
                cardImg.src = '';
                titleDiv.textContent = '';
                countage++;
            }
    }
    

    const animeCards = document.querySelector('.anime-cards');
    let page = 0;
    animeCards.addEventListener('click', (e) => {
        let indOfAnime = parseInt(e.target.id)-1 + page;
        console.log('ind: ',indOfAnime);
        if(indOfAnime < totalPresent){
            coverImg.src = stuff?.data?.[indOfAnime]?.images?.webp?.image_url;
            trailerPrint(stuff, indOfAnime);
            nameOfAnime.textContent = stuff?.data?.[indOfAnime]?.titles?.[0]?.title;
            // e.target.classList.add('card-focus');
            let divSelect = document.querySelector(`#card-${indOfAnime+1-page}`);
            divSelect.classList.add('card-focus');
            // animeDesc.textContent = stuff?.data?.[indOfAnime]?.synopsis.split().slice(0,31).join(' ');
            descriptionPrint(stuff, indOfAnime);
            detailPrint(stuff, indOfAnime);
            for(let i=0;i<Math.min(10,totalPresent);i++){
                if(i!=indOfAnime-page){
                    document.querySelector(`#card-${i+1}`).classList.remove('card-focus');
                }
            }
        }
        else{
            for(let i=0;i<Math.min(10,totalPresent);i++){
                document.querySelector(`#card-${i+1}`).classList.remove('card-focus');
            }
        }
    })


    
    let ans = Math.ceil(totalPresent/10);
    if(ans>1){
        document.querySelector('.navigate').setAttribute('style', 'z-index: 40;');
        // document.querySelectorAll('.fa-solid').style.display = 'flex';
        for(let i = 1;i<=ans;i++){
            document.querySelector(`#page-${i}`).style.display = 'flex';
        }
    }
    else{
        document.querySelector('.navigate').setAttribute('style', 'z-index: -100');

    }
    let currentPage = 1;
    let navigator = document.querySelector('.navigate');
    navigator.addEventListener('click', (e) => {
        // let leftArrow = document.querySelector('.fa-arrow-left');
        // let rightArrow = document.querySelector('.fa-arrow-right');
        if((e.target.id == 'right-arrow') && (currentPage<ans)){
            currentPage++;
            page+=10;
            console.log('currentpage in right: ',currentPage);
            let startRight = (currentPage-1)*10+1;
            let idStartRight = startRight%10;
            if(currentPage<=3){
                // while(countage <= Math.min(10+10*currentPage, totalPresent)){
                    // document.getElementById(`${countage-10*currentPage}-card-img`).src = stuff?.data?.[countage-1]?.images?.webp?.image_url;
                    // document.getElementById(`title-${countage-10*currentPage}`).textContent = stuff?.data?.[countage-1]?.titles?.[0]?.title;
                //     countage++;
                //     console.log('countage after right: ',countage);
                // }
                
                for(;idStartRight<=10;idStartRight++,startRight++){
                    let cSrc = stuff?.data?.[startRight-1]?.images?.webp?.image_url;
                    if(cSrc){
                        document.getElementById(`${idStartRight}-card-img`).src = cSrc;
                        
                    }
                    else{
                        document.getElementById(`card-${idStartRight}`).setAttribute('style','z-index:-100');
                    }
                    let cTitle = stuff?.data?.[startRight-1]?.titles?.[0]?.title;
                    if(cTitle){
                        document.getElementById(`title-${idStartRight}`).textContent = cTitle;
                    }
                }
            }
        }
        else if((e.target.id == 'left-arrow') && (currentPage>1)){
            page-=10;
            if(currentPage<=3){
                currentPage--;
                // console.log('currentpage in left: ',currentPage);
                // while(countage <= Math.min(10+10*currentPage, totalPresent)){
                    // document.getElementById(`${countage-10*currentPage}-card-img`).src = stuff?.data?.[countage-1]?.images?.webp?.image_url;
                    // document.getElementById(`title-${countage-10*currentPage}`).textContent = stuff?.data?.[countage-1]?.titles?.[0]?.title;
                //     countage++;
                //     console.log('countage after left: ',countage);
                // }
                // let temp = countage;
                let start = (currentPage-1)*10+1;
                let idStart = start%10;
                countage = start;
                // let end = 
                for(;idStart<=10;start++,idStart++){
                    console.log('start',start,' idStart',idStart);
                    document.getElementById(`card-${idStart}`).setAttribute('style','z-index:100');
                    document.getElementById(`${idStart}-card-img`).src = stuff?.data?.[start-1]?.images?.webp?.image_url;
                    document.getElementById(`title-${idStart}`).textContent = stuff?.data?.[start-1]?.titles?.[0]?.title;
                    // temp--;
                }
            }
        }
    })
}

async function workWithData(val){
    let url = `https://api.jikan.moe/v4/anime?q=${val}&sfw`;
    let response = await fetch(url);
    let received = await response.json();
    console.log(received);
    // for(item of received?.data){
    //     console.log(item?.mal_id);
    //     console.log('Countage: ',++countage);
    // }
    // console.log(received?.pagination?.items?.count)
    renderWith(received);
}
inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let val = inputField.value;
    if(val.length!=0){
        workWithData(val);
    }
    
})
let bg = document.querySelector('.bg-image');
document.querySelector('#mode-btn').addEventListener('click', (e) => {
    if(e.target.classList.contains('fa-sun')){
        bg.src = 'Images/background-dark.jpg';
    }
    else{
        bg.src = 'Images/background.jpg';
    }
    e.target.classList.toggle('fa-sun');
    e.target.classList.toggle('fa-moon');
})