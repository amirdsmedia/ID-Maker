let frontCropper, backCropper;
const frontImage = document.getElementById('frontImage');
const backImage = document.getElementById('backImage');
const previewImage = document.getElementById('previewImage');
const previewContainer = document.getElementById('previewContainer');

document.getElementById('frontImageInput').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        frontImage.src = event.target.result;
        frontImage.style.display = 'block';
        frontCropper = new Cropper(frontImage, {
            aspectRatio: NaN,
        });
    };
    reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('backImageInput').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        backImage.src = event.target.result;
        backImage.style.display = 'block';
        backCropper = new Cropper(backImage, {
            aspectRatio: NaN,
        });
    };
    reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('previewBtn').addEventListener('click', function () {
    const frontCroppedCanvas = frontCropper.getCroppedCanvas();
    const backCroppedCanvas = backCropper.getCroppedCanvas();

    const previewCanvas = document.createElement('canvas');
    const context = previewCanvas.getContext('2d');

    const outputWidth = Math.max(frontCroppedCanvas.width, backCroppedCanvas.width);
    const frontHeight = frontCroppedCanvas.height * (outputWidth / frontCroppedCanvas.width);
    const backHeight = backCroppedCanvas.height * (outputWidth / backCroppedCanvas.width);

    previewCanvas.width = outputWidth;
    previewCanvas.height = frontHeight + backHeight;

    context.drawImage(frontCroppedCanvas, 0, 0, outputWidth, frontHeight);
    context.drawImage(backCroppedCanvas, 0, frontHeight, outputWidth, backHeight);

    previewImage.src = previewCanvas.toDataURL();
    previewContainer.style.display = 'block';

    document.getElementById('downloadJpgBtn').addEventListener('click', function () {
        previewCanvas.toBlob(function (blob) {
            const formData = new FormData();
            formData.append('image', blob);

            fetch('/generate_jpg', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'id_card.jpg';
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        });
    });

    document.getElementById('downloadPdfBtn').addEventListener('click', function () {
        previewCanvas.toBlob(function (blob) {
            const formData = new FormData();
            formData.append('image', blob);

            fetch('/generate_pdf', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'id_card.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        });
    });
});
