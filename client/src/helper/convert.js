// function to convert image to base64 so that we can store the image to the database;

function convertToBase64(file){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        
        fileReader.onload = () =>{
            resolve(fileReader.result);
        }

        fileReader.onerror = error => {
            reject(error);
        }
    })

    
}

module.exports = convertToBase64;