
async function startWebsite(){

// data of the API
const DATA_API = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";

// images link in the API is not working, hence replicated the images part over here
const images = [
    { src : "https://images.unsplash.com/photo-1637563763312-820158759bab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHxvMDZ6NFA2OHJVUXx8ZW58MHx8fHx8"},
    { src : "https://images.unsplash.com/photo-1638178220878-f7d2da5f709b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxvMDZ6NFA2OHJVUXx8ZW58MHx8fHx8"},
    { src : "https://images.unsplash.com/photo-1636967626118-86ce925d1a16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxvMDZ6NFA2OHJVUXx8ZW58MHx8fHx8"},
    { src : "https://images.unsplash.com/photo-1638178220947-2c1a15ef0d39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3xvMDZ6NFA2OHJVUXx8ZW58MHx8fHx8"},
]

// function that fetches data
async function getData(){

    try{
        const info = await fetch(DATA_API);
        const json = await info.json();
        return json;
    }
    catch(err){
        console.log("Error fetching data", err);
        return "Error fetching data";
    }
    
}

const data = await getData();

// targeting the required elements
const mainImg = document.querySelector(".main-img");
const tumbnailContainer = document.querySelector(".tumbnail-container");
const vendor = document.querySelector(".vendor");
const title = document.querySelector(".title");
const price = document.querySelector(".price");
const percentOff = document.querySelector(".percent-off");
const compareAtPrice = document.querySelector(".compare-at-price");
const colorContainer = document.querySelector(".select-color");
const sizeContainer = document.querySelector(".select-size");
const description = document.querySelector(".para");

// variables
let sizeIndex = 0;
let borderIndex = 0;
let colorIndex = 0;


// setting main image
mainImg.src = images[0].src;


// setting tumbnails
// here we iterate through each element of image array
// while each iteration we create an image tag, provide url, add class name and append it in tumbnailContainer
images.map((ele, idx) => {

    const imgElement = document.createElement("img");
    imgElement.src = ele.src;
    imgElement.classList.add("tumbnail");

    if(idx==0){
        imgElement.style.border = "3px solid #284b7c";
    }

    tumbnailContainer.appendChild(imgElement);
})

// function to calculate percentOff
function calculatePercentOff(markedPrice, sellingPrice){

    const mp = Number(markedPrice.slice(1));
    const sp = Number(sellingPrice.slice(1));

    const discount = Math.floor(100 - ((sp/mp)*100));
    return discount;
}

vendor.innerHTML = data?.product?.vendor;
title.innerHTML = data?.product?.title;
price.innerHTML = data?.product?.price + ".00";
percentOff.innerHTML = calculatePercentOff(data?.product?.compare_at_price, data?.product?.price) + "% Off";
compareAtPrice.innerHTML = data?.product?.compare_at_price + ".00";

// to iterate over each color provided in the API and show it in UI
const colors = data?.product?.options[0]?.values;
console.log(Object.keys(colors[0]));

colors.map( (color, idx) => {

    const wrapper = document.createElement("div");

    const colorElement = document.createElement("div");
    colorElement.classList.add("color");
    colorElement.style.backgroundColor = Object.values(color)[0];

    wrapper.appendChild(colorElement);
    wrapper.style.padding = "5px";
    wrapper.style.border = "2px solid white";
    
    if(idx === 0)
    {
        const img = document.createElement("img");
        img.src = "./assets/check.png";
    
        colorElement.appendChild(img); 
        wrapper.style.border = "2px solid " + Object.values(color)[0];       
    }

    

    colorContainer.appendChild(wrapper);
})

// to iterate over each size provided in the API and show it in UI
const sizes = data?.product?.options[1]?.values;
console.log(sizes);
sizes.map( (size, idx) => {

    const sizeElement = document.createElement("div");

    const left =  document.createElement("div");
    left.classList.add("size-circle")
    const insideLeft = document.createElement("div");
    insideLeft.classList.add("size-fill");


    left.appendChild(insideLeft);

    const right = document.createElement("div");
    right.innerHTML = size;

    sizeElement.appendChild(left);
    sizeElement.appendChild(right);  
    
    sizeElement.classList.add("size-option");

    sizeContainer.appendChild(sizeElement);

    if(idx == 0)
    {
        insideLeft.style.backgroundColor = "#284b7c";
        left.style.border = "1px solid #284b7c";

        right.style.color = "#284b7c";
        right.parentElement.style.backgroundColor = "#e4ebf4";
    }
})

description.innerHTML = data?.product?.description;


// event listeners

// to navigate the images 
const tumbnailList = document.querySelectorAll(".tumbnail");
const tumbnailArr = Array.from(tumbnailList);


tumbnailArr.map((ele, idx)=>{
    ele.addEventListener("click", ()=>{
        tumbnailArr[borderIndex].style.border = "none";

        ele.style.border = "3px solid #284b7c";
        borderIndex = idx;

        mainImg.src = images[idx].src;
    })
})

// to increase and decrease the quantity of the product
const count = document.querySelector(".count");
const decrease = document.querySelector(".decrease");
const increase = document.querySelector(".increase");

increase.addEventListener("click", ()=>{
    count.innerHTML = Number(count.innerHTML) + 1;
})

decrease.addEventListener("click", ()=>{
    const temp = Number(count.innerHTML);

    if(temp > 1)
    {
        count.innerHTML = temp - 1;        
    }
})


// to select the color
const colorList = document.querySelectorAll(".color");
const colorArr = Array.from(colorList);


colorArr.map((ele, idx) => {
    ele.addEventListener("click", ()=>{
        colorArr[colorIndex].parentElement.style.border = "white";
        colorArr[colorIndex].innerHTML = "";

        ele.parentElement.style.border = "2px solid " + Object.values(colors[idx])[0];
        
        const img = document.createElement("img");
        img.src = "./assets/check.png";
        
        ele.appendChild(img); 
        
        colorIndex = idx;        
    })
})

// to choose size
const sizeList = document.querySelectorAll(".size-option");
const sizeArr = Array.from(sizeList);


sizeArr.map((ele, idx)=>{
    
    ele.addEventListener("click", ()=>{
        sizeArr[sizeIndex].style.backgroundColor = "#eee";
        sizeArr[sizeIndex].firstChild.style.border = "1px solid black";
        sizeArr[sizeIndex].firstChild.firstChild.style.backgroundColor = "transparent";
        sizeArr[sizeIndex].lastChild.style.color = "black";
        
        ele.style.backgroundColor = "#e4ebf4";
        ele.firstChild.style.border = "1px solid #284b7c";
        ele.firstChild.firstChild.style.backgroundColor = "#284b7c";
        ele.lastChild.style.color = "#284b7c";
        
        sizeIndex = idx;
    })
})

// to give added to cart message
const cartMsg = document.querySelector(".cart-msg");
const addToCart = document.querySelector(".add-to-cart");

addToCart.addEventListener("click", ()=>{
    cartMsg.innerHTML = "Embrace Sideboard with color "+ (Object.keys(colors[colorIndex])[0]).toLowerCase() +" and size " + sizes[sizeIndex].toLowerCase() + " added to cart";
    cartMsg.style.display = "block";
})

}

startWebsite();








