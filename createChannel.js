const newChannelForm = document.querySelector("form");
const errorH2 = newChannelForm.querySelector(".Error");

const MAIN_URL = "http://localhost:5000/";
const CREATE_CHANNEL_URL = MAIN_URL + "createChannel";

newChannelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    CreateChannel();
})

function CreateChannel() {
    const formData = new FormData(newChannelForm);
    const newChannelText = formData.get("newChannel");

    const obj = {
        newChannelText
    }

    newChannelForm.reset();

    fetch(CREATE_CHANNEL_URL, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json())
        .then(newChannel => {
            if (newChannel == "ERROR: ALREAY EXISTS") {
                console.log("ERROR");
                errorH2.textContent = "Error: Either the channel already exist or you typed something wrong";
                return;
            }

            errorH2.textContent = "";

            console.log(newChannel);
        });
}