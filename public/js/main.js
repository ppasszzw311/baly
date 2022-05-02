const userName = document.getElementById('userName')
const logout = document.getElementById('logout')

logout.addEventListener('click', e=> localStorage.clear())

getUserInfo()


// get user info
function getUserInfo() {
  let token = JSON.parse(localStorage.getItem('token'))
  axios.get(`/api/userInfo/${token}`)
    .then( (response) => {
      let u_name = response.data.user_name
      let userid = response.data.user_id
      let store_id = response.data.store_id
      userName.innerText = u_name
      localStorage.setItem("Name", u_name)
      localStorage.setItem("user_id", userid)
      localStorage.setItem("store_id", store_id)
    })
    .catch( (err) => console.log(err))
}


let access = localStorage.getItem('token')
console.log(access)

if ( access !== null) {
  document.getElementById('loginarea').style.visibility = "visible"
  document.getElementById('userarea').style.visibility = "visible"
} else {
  document.getElementById('loginarea').style.visibility = "hidden"
  document.getElementById('userarea').style.visibility = "hidden"
}


// 確認登入
function mainLogin() {
  const token = localStorage.getItem('token')
  if (token.length < 10) {
    window.location.href = "/login"
  }
}



function testfunction() {
  //alert("hello")
  function onButtonClick() {
    let filters = [];

    let filterService = document.querySelector('#service').value;
    if (filterService.startsWith('0x')) {
      filterService = parseInt(filterService);
    }
    if (filterService) {
      filters.push({ services: [filterService] });
    }

    let filterName = document.querySelector('#name').value;
    if (filterName) {
      filters.push({ name: filterName });
    }

    let filterNamePrefix = document.querySelector('#namePrefix').value;
    if (filterNamePrefix) {
      filters.push({ namePrefix: filterNamePrefix });
    }

    let options = {};
    if (document.querySelector('#allDevices').checked) {
      options.acceptAllDevices = true;
    } else {
      options.filters = filters;
    }

    log('Requesting Bluetooth Device...');
    log('with ' + JSON.stringify(options));
    navigator.bluetooth.requestDevice(options)
      .then(device => {
        log('> Name:             ' + device.name);
        log('> Id:               ' + device.id);
        log('> Connected:        ' + device.gatt.connected);
      })
      .catch(error => {
        log('Argh! ' + error);
      });
  }
  // jsBridge.xprinter.onDiscovery(function (succ, data) {
  //   alert("hello")
  //   alert(JSON.stringify(data));
  // });
  // jsBridge.xprinter.connectBtPort({
  //   //蓝牙MAC地址
  //   address: "DC:0D:30:83:AF:B7"
  // }, function (succ, data) {
  //   alert(succ ? "成功" : "失败\n" + JSON.stringify(data));
  // });
}


const button = document.getElementById("getDetails");
const details = document.getElementById("details");

button.addEventListener("click", async () => {
  try {
    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      optionalServices: ["battery_service", "device_information"],
      acceptAllDevices: true,
    });

    // Connect to the GATT server
    // We also get the name of the Bluetooth device here
    let deviceName = device.gatt.device.name;
    const server = await device.gatt.connect();

    // Getting the services we mentioned before through GATT server
    const batteryService = await server.getPrimaryService("battery_service");
    const infoService = await server.getPrimaryService("device_information");

    // Getting the current battery level
    const batteryLevelCharacteristic = await batteryService.getCharacteristic(
      "battery_level"
    );
    // Convert recieved buffer to number
    const batteryLevel = await batteryLevelCharacteristic.readValue();
    const batteryPercent = await batteryLevel.getUint8(0);

    // Getting device information
    // We will get all characteristics from device_information
    const infoCharacteristics = await infoService.getCharacteristics();

    console.log(infoCharacteristics);

    let infoValues = [];

    const promise = new Promise((resolve, reject) => {
      infoCharacteristics.forEach(async (characteristic, index, array) => {
        // Returns a buffer
        const value = await characteristic.readValue();
        console.log(new TextDecoder().decode(value));
        // Convert the buffer to string
        infoValues.push(new TextDecoder().decode(value));
        if (index === array.length - 1) resolve();
      });
    });

    promise.then(() => {
      console.log(infoValues);
      // Display all the information on the screen
      // use innerHTML
      details.innerHTML = `
      Device Name - ${deviceName}<br />
      Battery Level - ${batteryPercent}%<br />
      Device Information:
      <ul>
        ${infoValues.map((value) => `<li>${value}</li>`).join("")}
      </ul> 
    `;
    });
  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});



      'use strict';
      document.addEventListener('WebComponentsReady', function() {
        let progress = document.querySelector('#progress');
        let dialog = document.querySelector('#dialog');
        let message = document.querySelector('#message');
        let printButton = document.querySelector('#print');
        let printCharacteristic;
        let index = 0;
        let data;
        progress.hidden = true;

        let image = document.querySelector('#image');
        // Use the canvas to get image data
        let canvas = document.createElement('canvas');
        // Canvas dimensions need to be a multiple of 40 for this printer
        canvas.width = 120;
        canvas.height = 120;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        function getDarkPixel(x, y) {
          // Return the pixels that will be printed black
          let red = imageData[((canvas.width * y) + x) * 4];
          let green = imageData[((canvas.width * y) + x) * 4 + 1];
          let blue = imageData[((canvas.width * y) + x) * 4 + 2];
          return (red + green + blue) > 0 ? 1 : 0;
        }

        function getImagePrintData() {
          if (imageData == null) {
            console.log('No image to print!');
            return new Uint8Array([]);
          }
          // Each 8 pixels in a row is represented by a byte
          let printData = new Uint8Array(canvas.width / 8 * canvas.height + 8);
          let offset = 0;
          // Set the header bytes for printing the image
          printData[0] = 29;  // Print raster bitmap
          printData[1] = 118; // Print raster bitmap
          printData[2] = 48; // Print raster bitmap
          printData[3] = 0;  // Normal 203.2 DPI
          printData[4] = canvas.width / 8; // Number of horizontal data bits (LSB)
          printData[5] = 0; // Number of horizontal data bits (MSB)
          printData[6] = canvas.height % 256; // Number of vertical data bits (LSB)
          printData[7] = canvas.height / 256;  // Number of vertical data bits (MSB)
          offset = 7;
          // Loop through image rows in bytes
          for (let i = 0; i < canvas.height; ++i) {
            for (let k = 0; k < canvas.width / 8; ++k) {
              let k8 = k * 8;
              //  Pixel to bit position mapping
              printData[++offset] = getDarkPixel(k8 + 0, i) * 128 + getDarkPixel(k8 + 1, i) * 64 +
                          getDarkPixel(k8 + 2, i) * 32 + getDarkPixel(k8 + 3, i) * 16 +
                          getDarkPixel(k8 + 4, i) * 8 + getDarkPixel(k8 + 5, i) * 4 +
                          getDarkPixel(k8 + 6, i) * 2 + getDarkPixel(k8 + 7, i);
            }
          }
          return printData;
        }

        function handleError(error) {
          console.log(error);
          progress.hidden = true;
          printCharacteristic = null;
          dialog.open();
        }

        function sendNextImageDataBatch(resolve, reject) {
          // Can only write 512 bytes at a time to the characteristic
          // Need to send the image data in 512 byte batches
          if (index + 512 < data.length) {
            printCharacteristic.writeValue(data.slice(index, index + 512)).then(() => {
              index += 512;
              sendNextImageDataBatch(resolve, reject);
            })
            .catch(error => reject(error));
          } else {
            // Send the last bytes
            if (index < data.length) {
              printCharacteristic.writeValue(data.slice(index, data.length)).then(() => {
                resolve();
              })
              .catch(error => reject(error));
            } else {
              resolve();
            }
          }
        }

        function sendImageData() {
          index = 0;
          data = getImagePrintData();
          return new Promise(function(resolve, reject) {
            sendNextImageDataBatch(resolve, reject);
          });
        }

        function sendTextData() {
          // Get the bytes for the text
          let encoder = new TextEncoder("utf-8");
          // Add line feed + carriage return chars to text
          let text = encoder.encode(message.value + '\u000A\u000D');
          return printCharacteristic.writeValue(text).then(() => {
            console.log('Write done.');
          });
        }

        function sendPrinterData() {
          // Print an image followed by the text
          sendImageData()
          .then(sendTextData)
          .then(() => {
            progress.hidden = true;
          })
          .catch(handleError);
        }

        printButton.addEventListener('click', function () {
          progress.hidden = false;
          if (printCharacteristic == null) {
            navigator.bluetooth.requestDevice({
              filters: [{
                services: ['000018f0-0000-1000-8000-00805f9b34fb']
              }]
            })
            .then(device => {
              console.log('> Found ' + device.name);
              console.log('Connecting to GATT Server...');
              return device.gatt.connect();
            })
            .then(server => server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb"))
            .then(service => service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb"))
            .then(characteristic => {
              // Cache the characteristic
              printCharacteristic = characteristic;
              sendPrinterData();
            })
            .catch(handleError);
          } else {
            sendPrinterData();
          }
        });
      });
    