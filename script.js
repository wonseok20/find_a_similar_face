

function ekUpload() {

    function InitScript() {
        // console.log('Upload Initialised');

        var fileSelect = document.getElementById('file-upload'),
            fileDrag = document.getElementById('file-drag'),
            submitButton = document.getElementById('submit-button');

        fileSelect.addEventListener('change', fileSelectHandler, false);

        // Is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // File Drop
            fileDrag.addEventListener('dragover', fileDragHover, false);
            fileDrag.addEventListener('dragleave', fileDragHover, false);
            fileDrag.addEventListener('drop', fileSelectHandler, false);
        }
    }

    function fileDragHover(e) {
        var fileDrag = document.getElementById('file-drag');

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className = e.type === 'dragover' ? 'hover' : 'modal-body file-upload';
    }

    function fileSelectHandler(e) {
        // Fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        fileDragHover(e);

        // Process all File objects
        for (var i = 0, f;
            (f = files[i]); i++) {
            parseFile(f);
            uploadFile(f);
        }
    }

    //Output
    function output(msg) {
        // Response
        var m = document.getElementById('messages');
        m.innerHTML = msg;
    }

    function parseFile(file) {
        // console.log(file.name);
        output('<strong>' + encodeURI(file.name) + '</strong>');

        // var fileType = file.type;
        // console.log(fileType);
        var imageName = file.name;

        var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
        if (isGood) {
            document.getElementById('start').classList.add('hidden');
            document.getElementById('response').classList.remove('hidden');
            document.getElementById('notimage').classList.add('hidden');
            // Thumbnail Preview
            document.getElementById('file-image').classList.remove('hidden');
            // document.getElementById('file-image1').classList.remove('hidden');

            // document.getElementById('file-image').src = URL.createObjectURL(file);
            document.getElementById('file-image').src = webkitURL.createObjectURL(file);
            document.getElementById('file-image1').src = webkitURL.createObjectURL(file);

            console.log(document.getElementById('file-image').src);


        
            

            // document.getElementById('file-image1').src = webkitURL.createObjectURL(file);
            init().then(() => {
                predict();
            });
        } else {
            document.getElementById('file-image').classList.add('hidden');
            document.getElementById('file-image1').classList.add('hidden');
            document.getElementById('file-image2').classList.add('hidden');
            document.getElementById('file-image3').classList.add('hidden');
            document.getElementById('notimage').classList.remove('hidden');
            document.getElementById('start').classList.remove('hidden');
            document.getElementById('response').classList.add('hidden');
            document.getElementById('file-upload-form').reset();
        }
    }

    function setProgressMaxValue(e) {
        var pBar = document.getElementById('file-progress');

        if (e.lengthComputable) {
            pBar.max = e.total;
        }
    }

    function updateFileProgress(e) {
        var pBar = document.getElementById('file-progress');
        console.log(pBar);
        if (e.lengthComputable) {
            pBar.value = e.loaded;
        }
    }

    function uploadFile(file) {
        var xhr = new XMLHttpRequest(),
            fileInput = document.getElementById('class-roster-file'),
            pBar = document.getElementById('file-progress'),
            fileSizeLimit = 1024; // In MB
        document.getElementById('loading').classList.remove('visually-hidden');

        if (xhr.upload) {
            // Check if file is less than x MB
            if (file.size <= fileSizeLimit * 1024 * 1024) {
                // Progress bar
                // pBar.style.display = 'inline';
                xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
                xhr.upload.addEventListener('progress', updateFileProgress, false);

                // File received / failed
                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState == 4) {
                        // Everything is good!
                        // progress.className = (xhr.status == 200 ? "success" : "failure");
                        // document.location.reload(true);
                    }
                };

                // Start upload
                xhr.open('GET', document.getElementById('file-upload-form').action, true);
                xhr.setRequestHeader('X-File-Name', file.name);
                xhr.setRequestHeader('X-File-Size', file.size);
                xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(file);
            } else {
                output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
            }
        }
    }

    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
        InitScript();
    } else {
        document.getElementById('file-drag').style.display = 'none';
    }
}
ekUpload();

// File Upload
//

//
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
//const URL = 'https://teachablemachine.withgoogle.com/models/M2jF52GKB/';
// ???????????????


// ???????????????

let model, labelContainer, maxPredictions, gender, URL,lavelImage;
gender = document.getElementById('gender').innerText;
// console.log(`gender=${gender}`);



switch (gender){
    case '??????' : URL = `https://teachablemachine.withgoogle.com/models/ZJzMn0AnF/`;
                    imageForderName = "male_actor";
        break;
    case '??????' : URL = 'https://teachablemachine.withgoogle.com/models/ImPmngLrw/';
                    imageForderName = "female_actor";
        break;
    default:
        URL = `https://teachablemachine.withgoogle.com/models/ImPmngLrw/`;
}
// console.log(`imageForderName= ${imageForderName}`)

// Load the image model and setup the webcam
async function init() {
    document.getElementById('messages').innerHTML = "Google Teachable Machine(????????????) ?????? ???";
    document.getElementById('label-container').style.display = 'none';
    document.getElementById(`label-container`).innerHTML = "";
    document.getElementById('file-image1').classList.add('hidden');
    document.getElementById('file-image2').classList.add('hidden');
    document.getElementById('file-image3').classList.add('hidden');
    document.getElementById('file')


    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';


    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    // const flip = true; // whether to flip the webcam
    // webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    // await webcam.setup(); // request access to the webcam
    // await webcam.play();
    // window.requestAnimationFrame(loop);

    // append elements to the DOM
    // document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById('label-container');
    lavelImage = document.getElementById('label-image');
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement('div'));
        // lavelImage.appendChild(document.createElement('div'));
        
    }
    
}

// async function loop() {
//   webcam.update(); // update the webcam frame
//   await predict();
//   window.requestAnimationFrame(loop);
// }

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    document.getElementById('messages').innerHTML = `????????? ${maxPredictions}?????? ????????? ??????`;
    // output(`????????? TOP ${maxPredictions}?????? ????????? ??????`);
    document.getElementById('loading').classList.add('visually-hidden');
    document.getElementById('notice').classList.add('visually-hidden');
    document.getElementById('label-container').style.display = 'inline';

    let image = document.getElementById('file-image');
    const prediction = await model.predict(image, false);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    let Nopredict = 1;
    let entertainer = null;
    
    for (let i = 0; i < maxPredictions; i++) {
        let probabilityValue = parseFloat(prediction[i].probability.toFixed(2));
        probabilityValue = parseInt(Math.round(probabilityValue * 100));
        //console.log(probabilityValue);
        // const classPrediction = prediction[i].className + ": " + probabilityValue;
        //console.log(typeof(probabilityValue));
        //console.log(probabilityValue);
        entertainer = prediction[i].className;
        console.log(entertainer+": ?????? ??????"+ probabilityValue);
        
        if (probabilityValue > 80) {
            
            // 
            Nopredict += 1;
            console.log(`nopredict= ${Nopredict}`);
            labelContainer.childNodes[i].innerHTML =
                prediction[i].className + '???(???) </br>' + probabilityValue + "% ????????? ???????????????.<br><span style='color:blue;'> ??????! " + prediction[i].className  +"??? ?????? ?????????????</span>";
                document.getElementById('file-image2').src = `./${imageForderName}/${entertainer}/1.jpg`;
                document.getElementById('file-image3').src = `./${imageForderName}/${entertainer}/1.jpg`;
                document.getElementById('file-image1').classList.remove('hidden');
                document.getElementById('file-image2').classList.remove('hidden');
                document.getElementById('file-image3').classList.remove('hidden');
                console.log(`entertainer=`+entertainer);
            //    if(entertainer == null){
            //        labelContainer.childNodes[o].innerHTML = `80%?????? ?????? ???????????? ????????????.`
            //    }
        }else if(probabilityValue >= 50){
            // lavelImage.childNodes[i].innerHTML =
            // `<img src="./${prediction[i].className}.jpg" alt="Preview" class="hidden img-fluid " />`
           
            if(Nopredict == 1){
            labelContainer.childNodes[i].innerHTML =
            "<span style='color:red;'>80%?????? ?????? ????????? ????????? <br>???????????? "+prediction[i].className + '???(???)' + probabilityValue + "% ???????????????.</span>";
            }else{
                labelContainer.childNodes[i].innerHTML =
            "<span style='color:red;'>???????????? "+prediction[i].className + '???(???)' + probabilityValue + "% ???????????????.</span>";    
            }
            Nopredict += 1;

        }else if(probabilityValue >= 20){
            // lavelImage.childNodes[i].innerHTML =
            // `<img src="./${prediction[i].className}.jpg" alt="Preview" class="hidden img-fluid " />`
           if(Nopredict==1){
            labelContainer.childNodes[i].innerHTML =
            "<span style='color:red;'>50%?????? ?????? ????????? ?????????<br> "+prediction[i].className + '???(???) ' + probabilityValue + "% ???????????????.</span>";
           }else{
            labelContainer.childNodes[i].innerHTML =
            "<span style='color:red;'>?????? ???????????? ????????? ?????? ???????????????<br> "+prediction[i].className + '???(???)' + probabilityValue + "% ???????????????.</span>";
           }
            Nopredict += 1;
        }
    }
    if(Nopredict == 1){
        // console.log(`nopredict1=${Nopredict}`);
        document.getElementById(`label-container`).innerHTML = 
        `???????????? ????????? ????????? ??? 10%?????? ?????? ????????? ????????????.<br> <span style='color:blue;'> ?????? ??? ?????? ???????????? ?????? ????????? ?????? ?????? ??????????????????.</span>`;
    }
}

//
// teachable machine end

