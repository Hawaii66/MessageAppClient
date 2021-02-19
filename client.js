const newPostForm = document.querySelector(".newPost");
const swithChannelForm = document.querySelector(".newChannel");
const createChannelForm = document.querySelector(".CreateChannel");
const messageParent = document.querySelector(".Messages");
const createChannelDiv = document.querySelector(".CreateChannelDiv");

const website_URL = "https://simplemessageapp.herokuapp.com/"
const old_URL = "http://localhost:5000/";
const MAIN_URL = website_URL;
const SEND_MESSAGE_URL = MAIN_URL + "newMessage";
const SEND_NEW_CHANNEL_URL = MAIN_URL + "newChannel";
const GET_ALL_MESSAEGES_FROM_CHANNEL = MAIN_URL;
const CREATE_CHANNEL_URL = MAIN_URL + "createChannel";

const loading = document.querySelector(".loading");

const defaultChannels = ["All", "Random", "Food", "Homework"];

currentChannel = "All";

SetLoading();

swithChannelForm.querySelector("#otherName").style.display = "none";
swithChannelForm.querySelector(".otherNameSubmit").style.display = "none";
newPostForm.querySelector("#messageOtherChannel").style.display = "none";
newPostForm.querySelector(".Error").style.display = "none";
createChannelDiv.style.display = "none";
channels = document.querySelector(".ChannelMessages");
channels.querySelector(".Error").style.display = "none";
document.querySelector(".CreateChannelDiv").querySelector(".Error").style.display = "none";

GetChannelPosts();

newPostForm.addEventListener("submit", (event) => {
    event.preventDefault();
    SendMessage();
})

function MessageSelectChange() {
    const formData = new FormData(newPostForm);
    const channel = formData.get("channelTypes");
    if (channel == "Other") {
        newPostForm.querySelector("#messageOtherChannel").style.display = "";
    } else {
        newPostForm.querySelector("#messageOtherChannel").style.display = "none";
    }
}

function SendMessage() {
    const formData = new FormData(newPostForm);
    const name = formData.get("name");
    const message = formData.get("message");
    channel = formData.get("channelTypes");

    if (channel == "Other") {
        channel = formData.get("messageOtherChannel");
        currentChannel = channel;
    }

    const msg = {
        name,
        message,
        channel
    }

    SetLoading();
    newPostForm.reset();

    fetch(SEND_MESSAGE_URL, {
            method: "POST",
            body: JSON.stringify(msg),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json())
        .then(createdMessage => {
            if (createdMessage.message == "Please enter name and message") {
                newPostForm.querySelector(".Error").style.display = "";
                ResetLoading();
                return;
            }
            newPostForm.querySelector(".Error").style.display = "none";
            if (currentChannel == createdMessage.channel || currentChannel == "All") {
                GetChannelPosts();
            }
            ResetLoading();
        });
}

swithChannelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(swithChannelForm)
    currentChannel = formData.get("otherName");

    ChangeChannel(currentChannel);
});

function ChangeChannel(newChannelName) {
    //reset Error Message
    channels = document.querySelector(".ChannelMessages");
    channels.querySelector(".Error").style.display = "none";

    //Hide create channel menu
    createChannelDiv.querySelector("form").querySelector("#channelPassword").style.display = "none";
    createChannelDiv.querySelector("form").querySelector("#channelPasswordH3").style.display = "none";
    createChannelDiv.style.display = "none";


    channel = "";
    if (newChannelName == "") {
        const formData = new FormData(swithChannelForm);
        channel = formData.get("channelTypes");
    } else {
        channel = newChannelName;
    }

    if (channel == "Other") {
        swithChannelForm.querySelector("#otherName").style.display = "";
        swithChannelForm.querySelector(".otherNameSubmit").style.display = "";
        return;
    } else {
        swithChannelForm.querySelector("#otherName").style.display = "none";
        swithChannelForm.querySelector(".otherNameSubmit").style.display = "none";
    }

    const newChannel = {
        channel
    }

    if (channel == "NewChannel") {
        CreateNewChannel();
        return;
    }

    SetLoading();

    fetch(SEND_NEW_CHANNEL_URL, {
            method: "POST",
            body: JSON.stringify(newChannel),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json())
        .then(createdMessage => {
            currentChannel = createdMessage.channel;
            GetChannelPosts();
            ResetLoading();
        });
}

//#region createChannel

function showPassword() {
    const formData = new FormData(createChannelForm);
    usePassword = formData.get("checkBox");
    if (usePassword === "on") {
        createChannelForm.querySelector("#channelPassword").style.display = "";
    } else {
        createChannelForm.querySelector("#channelPassword").style.display = "none";
    }
}

createChannelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createChannel();
})

function createChannel() {


    const formData = new FormData(createChannelForm);
    const channelName = formData.get("channelName");
    const usePassword = formData.get("checkBox");
    let channelPassword = "";

    if (usePassword === "on") {
        channelPassword = formData.get("channelPassword");
    }

    if (channelName === "") {
        console.log("ERROR");
        CreateChannelError();
        return;
    }
    if (usePassword === "on" && channelPassword === "") {
        console.log("ERROR");
        CreateChannelError();
        return;
    }

    obj = {
        name: channelName,
        password: channelPassword
    }

    createChannelForm.reset();
    createChannelForm.querySelector("#channelPassword").style.display = "none";

    fetch(CREATE_CHANNEL_URL, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "content-type": "application/json"
        }
    }).then(response => response.json()).then(createdChannel => {
        console.log(createdChannel);
        if (createdChannel === "ERROR: ALREAY EXISTS") {
            console.log("ERROR");
            CreateChannelError();
        } else {
            console.log("CREATED");
        }
    });
};

function CreateChannelError() {
    document.querySelector(".CreateChannelDiv").querySelector(".Error").style.display = "";
}

function CreateNewChannel() {
    //window.location.href = "https://simplemessageapp.netlify.app/createChannel.html";
    //window.location.href = "http://127.0.0.1:5500/Client/pages/createChannel.html";
    createChannelDiv.style.display = "";
    //Reset error message
    document.querySelector(".CreateChannelDiv").querySelector(".Error").style.display = "none";
}

//#endregion

function GetChannelPosts() {
    isDefault = false;
    for (let i = 0; i < defaultChannels.length; i++) {
        if (currentChannel == defaultChannels[i]) {
            isDefault = true;
        }
    }

    if (isDefault) {
        fetch(GET_ALL_MESSAEGES_FROM_CHANNEL + currentChannel, {
                method: "GET"
            }).then(response => response.json())
            .then(createdMessage => {
                messageParent.innerHTML = "";
                for (let i = 0; i < createdMessage.length; i++) {
                    GenerateMessage(createdMessage[i]);
                }
                ResetLoading();
            });
    } else {

        obj = {
            channel: currentChannel
        }

        fetch(GET_ALL_MESSAEGES_FROM_CHANNEL + "customChannel", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "content-type": "application/json"
                }
            }).then(response => response.json())
            .then(createdMessage => {
                console.log("TEST");
                if (createdMessage.message == "Channel Dont Exists") {
                    messageParent.innerHTML = "";

                    channels = document.querySelector(".ChannelMessages");
                    channels.querySelector(".Error").style.display = "";

                    ResetLoading();
                    return;
                }

                channels = document.querySelector(".ChannelMessages");
                channels.querySelector(".Error").style.display = "none";

                messageParent.innerHTML = "";
                for (let i = 0; i < createdMessage.length; i++) {
                    GenerateMessage(createdMessage[i]);
                }
                ResetLoading();
            });
    }
}

function GenerateMessage(msg) {
    const div = document.createElement("div");

    const header = document.createElement("h3");
    header.textContent = msg.name;

    const content = document.createElement("p");
    content.textContent = msg.message;

    div.appendChild(header);
    div.appendChild(content);
    div.className = "Message";

    messageParent.appendChild(div);
}

function SetLoading() {
    loading.style.display = "";
    newPostForm.style.display = "none";
    swithChannelForm.style.display = "none";
}

function ResetLoading() {
    loading.style.display = "none";
    newPostForm.style.display = "";
    swithChannelForm.style.display = "";
}