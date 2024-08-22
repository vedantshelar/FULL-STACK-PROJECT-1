let taxSwitch = document.getElementById('taxSwitch');
let gstPrices = document.getElementsByClassName('gstPrice');

taxSwitch.addEventListener('change',()=>{

    for(gstPrice of gstPrices){
        gstPrice.classList.toggle("active");
    }
    
 
})

