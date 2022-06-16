let productData, disc, discountedPrice;

const loadData = () => {
    var xhr = new XMLHttpRequest();
    xhr.onload = reqListener;
    xhr.onerror = reqError;
    xhr.open('get', 'json-data/products.json', true);
    xhr.send();
}
window.onload = loadData();

function reqListener() {
    productData = JSON.parse(this.responseText).products;
    // console.log(productData);
    let data;

    let product = document.getElementById('products');
    displayData(productData);

    /*  Convert checkboxes to an array to use filter and map. 
        Use Array.filter to remove unchecked checkboxes. 
        Use Array.map to extract only the checkbox values from the array of objects.
    */
    var brandcheckboxes = document.querySelectorAll("input[type=checkbox][name=brand]");
    var processorcheckboxes = document.querySelectorAll("input[type=checkbox][name=processor]");
    var ramcheckboxes = document.querySelectorAll("input[type=checkbox][name=ram]");
    let brands = [], processors = [], rams = [];
    brandcheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            brands = Array.from(brandcheckboxes).filter(i => i.checked).map(i => i.value) 
            filterByCategory();
        })
    });

    
    processorcheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            processors = Array.from(processorcheckboxes).filter(i => i.checked).map(i => i.value)
            filterByCategory();
        })
    });

    
    ramcheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            rams = Array.from(ramcheckboxes).filter(i => i.checked).map(i => i.value)
            filterByCategory();
        })
    });

    function filterData(data) {
        filteredData = data;
        if(brands.length !== 0) filteredData = filteredData.filter(val => brands.includes(val.brand));
        if(processors.length !== 0) filteredData = filteredData.filter(val => processors.includes(val.processor));
        if(rams.length !== 0) filteredData = filteredData.filter(val => rams.includes(val.features.ram));
        return filteredData;
    }

    function filterByCategory() {
        $("#products").html("");
        data = filterData(productData);
        displayData(data); 
    }

    document.getElementById('popularity').addEventListener('click', displayByPopularity);
    document.getElementById('lowToHigh').addEventListener('click', displayByLowToHigh);
    document.getElementById('highToLow').addEventListener('click', displayByHighToLow);

    function displayByPopularity() {
        $("#products").html("");
        data = filterData(productData);
        data.sort((a, b) => {
            return b.rating - a.rating;
        });
        displayData(data);         
    }

    function displayByLowToHigh() {
        $("#products").html("");
        data = filterData(productData);
        data.sort((a, b) => {
            return ((a.price/100)*(100-parseInt(a.discount.slice(0,a.discount.length-1)))).toFixed(2) - ((b.price/100)*(100-parseInt(b.discount.slice(0,b.discount.length-1)))).toFixed(2);
        });
        displayData(data); 
    }

    function displayByHighToLow() {
        $("#products").html("");
        data = filterData(productData);
        data.sort((a, b) => {
            return ((b.price/100)*(100-parseInt(b.discount.slice(0,b.discount.length-1)))).toFixed(2) - ((a.price/100)*(100-parseInt(a.discount.slice(0,a.discount.length-1)))).toFixed(2);
        });
        displayData(data);  
    }

    function displayData(data) {
        if(data.length === 0 ){
            $(`<div class="no-data">
                    <p class="text-danger">No Data Found</p>
                </div>`).appendTo(product);
        } else {
            for(const {name, price, image, discount, rating, features} of data){
                disc = parseInt(discount.slice(0,discount.length-1));
                discountedPrice = ((price/100)*(100-disc)).toFixed(2);
                $(`<div class="card m-1">
                        <figure>
                            <div class="cardimg text-center"><img class="py-3" src="${image}" alt="${name}"></div>
                            <figcaption class="text-center">${name}</figcaption>
                            <p class="text-center">&#8377;${discountedPrice}<br><s>&#8377;${price}</s>&nbsp;&nbsp;${discount} off</p>
                            <p class="px-3">ProcessorType : ${features.processor}<br>RAM : ${features.ram}<br>Hard Drive : ${features.storage}</p>
                            <p class="text-center">Rating: ${rating} &#11088;</p>
                        </figure>
                   </div>`).appendTo(product);           
            }
        }
    } 
}  

function reqError(err) {
    console.log('Fetch Error :-S', err);
}