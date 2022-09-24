
//GLOBAL VARIABLES
let gifListDiv= document.getElementById("gifsList")
gifListDiv.classList.add("d-flex")
gifListDiv.classList.add("flex-wrap")
const submitButton=document.getElementById("submitButton")
submitButton.style.borderRadius="10px"
submitButton.style.width="50%"
submitButton.style.alignSelf="center"
const inputSearch=document.getElementById("inputSearchGif")
const historyButtons=document.getElementById("historyButtons")
let offset=0
let typeGif="trending"
let inputValue=""
let historySearch= JSON.parse(localStorage.getItem('historySearch')) 
//LOAD LOCALSTORAGE

const loadHistoryButtons=()=>{
  historySearch.map(value=>{
    let button=document.createElement("button")
    button.classList.add("btn")
    button.classList.add("btn-secondary")
    button.classList.add("m-2")
    button.style.width="20%"
    button.style.borderRadius="20px"
    button.textContent=value
    button.addEventListener("click",setSearchedGifs)
    historyButtons.appendChild(button) 
  })
}
//SERVICES
const getTrendingGifs=()=>{
  const data= axios.get('https://api.giphy.com/v1/gifs/trending',{
  params:{
    api_key:'MTuxrYNBIVqUQ6A5pw1eOkLY5lgzZYu4',
    limit:25,
    rating:'r',
    offset:offset
  }
})
.then(function (response) {
  return response
})
.catch(function (error) {
  return  error
})
return data
}

const getSearchGifs=(input)=>{
  const data= axios.get('https://api.giphy.com/v1/gifs/search',{
  params:{
    api_key:'MTuxrYNBIVqUQ6A5pw1eOkLY5lgzZYu4',
    limit:25,
    q:input,
    rating:'g',
    offset:offset
    
  }
})
.then(function (response) {
  return response
})
.catch(function (error) {
  return  error
})
return data
}

//TRENDING GIFS
const createDivGif=(gif)=>{
  let gifImage=document.createElement("img")
  gifImage.src=gif.images.fixed_width_downsampled.url
  gifImage.classList.add("card-img-top")
  gifImage.classList.add("align-self-center")
  gifImage.style.width="200px"
  let gifTitle=document.createElement('h5')
  gifTitle.classList.add("text-center")
  gifTitle.innerText=gif.title
  let gifDiv=document.createElement("div")
  gifDiv.classList.add('card')
  gifDiv.style.width="300px"
  gifDiv.classList.add("m-2")
  gifDiv.setAttribute("idGif",gif.id)
  gifDiv.appendChild(gifImage)
  gifDiv.appendChild(gifTitle)
  return gifDiv 
}
const setTredingGifs=(trendingGifs)=>{
  gifListDiv.innerHTML = '';
  trendingGifs.map(gif=>{
    gifListDiv.appendChild(createDivGif(gif))
  })
  
}

//SEARCHED GIFS
const setSearchedGifs=async (e)=>{
  offset=0
  e.preventDefault()
  
 /*  if(e.srcElement.localName=="button") */
 if(e.target.textContent!=="Buscar"){
   inputValue=e.target.textContent
   inputSearch.value=""
 }else{
   inputValue=inputSearch.value
 }
  gifListDiv.innerHTML = '';
  if(inputValue==""){
    typeGif="trending"
    const data=await getTrendingGifs()
    setTredingGifs(data.data.data)
  }else{
    if(historySearch.length>0){
      if(!historySearch.some(item=>item==inputValue)){
        if(historySearch.length==3){
          historySearch.shift()
        }
        historySearch.push(inputValue)
        localStorage.setItem('historySearch', JSON.stringify(historySearch))
        historyButtons.innerHTML=""
        loadHistoryButtons()
        inputValue=""
      }
    }else{
      historySearch.push(inputValue)
      localStorage.setItem('historySearch', JSON.stringify(historySearch))
      loadHistoryButtons()
      inputValue=""
    }
    typeGif="searching"
    gifListDiv.childNodes.forEach(item=>item.remove())
    const searchedGifs=(await getSearchGifs(inputValue)).data.data
    searchedGifs.map(gif=>{
      gifListDiv.appendChild(createDivGif(gif))
    })
  }
  
}

const loadMore=async (e)=>{
console.log("loadmore",typeGif)
  if(window.scrollY + window.innerHeight >= 
    document.documentElement.scrollHeight){ 
      offset=offset+25
      if(typeGif=="trending"){
        console.log("entra")
        const data=await getTrendingGifs()
        data.data.data.map(gif=>{
          gifListDiv.appendChild(createDivGif(gif))
        })  
      }
      
      if(typeGif=="searching"){
        const searchedGifs=(await getSearchGifs(inputValue)).data.data
        searchedGifs.map(gif=>{
          gifListDiv.appendChild(createDivGif(gif))
        })
      }
      
    }
  }
  //LISTENERS
  submitButton.addEventListener("click",setSearchedGifs)
  window.addEventListener("scroll",loadMore)
  //MAIN
  const main =async()=>{
    loadHistoryButtons()
    const data=await getTrendingGifs()
    setTredingGifs(data.data.data)
  }
  
  main()