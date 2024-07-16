//Creating a class for our house. 
class House {
    constructor(name) {
        this.name = name; 
        this.rooms = []; 
    }
    //A method to be able to add new rooms. 
    addRoom(name, area) {
        this.rooms.push(new Room(name, area)); 
    }
}

//Creating a class for room in the house. 
class Room {
    constructor(name, area) {
        this.name = name; 
        this.area = area; 
    }
}

//Creating a class for house services. 
//Using API, and accessing their end points by using statics. 
//Using another method to utilizing all out CRUD Operations (getting the house (getting a specific house, creating a house, updating the house & deleting a house).
 class HouseService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses'; 
    //Getting all houses. 
    static getAllHouses() {
        return $.get(this.url); 
    }

    //Getting a house. 
    static getHouse(id) {
        return $.get(this.url + `/$(id)`); 
    }

    //creating a house. 
    static createHouse(house) {
        return $.post(this.url, house); 
    }

    // Were using two parameters in this one, along with the ajax-method(object,) and use the URL and concatenate it with the ID of the house we passed in. 
    static updateHouse(house) {
        return $.ajax({
            url: this.url + `/${house._id}`, 
            dataTypw: 'json', 
            data: JSON.stringify(house), 
            contentType: 'application/json', 
            type: 'PUT'
        });
    }

    //using the ajax-method for the delete-house option. 
    static deleteHouse(id) {
        return $.ajax({
            url: this.url + `/${id}`, 
            type: 'DELETE'
        });
    }
}

//Creating a DOM manager-class. 
class DOMManager {
    static houses; 

    static getAllHouses() {
        HouseService.getAllHouses().then(houses => this.render(houses)); 
    }

    //Create house option inside the DOM, and able to send request to grab all the houses from the API & render the houses. 
    static createHouse(name) {
        HouseService.createHouse(new House(name))
         .then (() => {
            return HouseService.getAllHouses(); 
         })
         .then((houses) => this.render(houses))
    }

    static deleteHouse(id) {
        HouseService.deleteHouse(id)
         .then(() => {
            return HouseService.getAllHouses();
         })
         .then((houses) => this.render(houses)); 
    }

    // To add rooms.

    static addRoom(id) {
        for (let house of this.houses) {
            if (house._id) {
                house.rooms.push(new Room($(`#${house._id}-room-name`).val(), $(`#${house._id}-room-area`).val())); 
                HouseService.updateHouse(house) 
                 .then(() => {
                    return HouseService.getAllHouses(); 
                 })
                 .then((houses) => this.render(houses)); 
            }
        }   
    }

    static deleteRoom (houseId, roomId) {
        for (let house of this.houses) {
            if (house._id == houseId) {
                for (let room of house.rooms) {
                    if (room._id == roomId) {
                        house.rooms.splice(house.rooms.indexOf(room), 1);
                        HouseService.updateHouse(house) 
                        .then(() => {
                            return HouseService.getAllHouses()
                        })
                        .then((houses) => this.render(houses)); 
                    }
                }
            }
        }
    }
    static render(houses) {
        this.houses = houses; 
        $('#app').empty(); 
        for (let house of houses) {
            $('#app').prepend(
                `<div id="${houses._id}" class="card">
                    <div class="card-reader">
                        <h2>${house.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class"row">
                                <div class"col-sm">
                                    <input type="text" id="${house._id}-room-name" class="form-control" placeholder="Room Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${house._id}-room-area" class="form-control" placeholder="Room Area">
                                </div>
                            </div>
                            <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
                );       
                for (let room of house.rooms) {
                    $(`#${house._id}`).find('.card-body').append(
                        `<p>
                          <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                          <span id="area-${room._id}"><strong>Area: </strong> ${room.area}</span>
                          <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}'. '${room._id}')">Delete Room</button>`
                        
                    );
                }  
            }
    }
}

$('#create-new-house').click(() => {
    DOMManager.createHouse($('#new-house-name').val()); 
    $('#new-house-name').val(''); 
}); 
DOMManager.getAllHouses();  