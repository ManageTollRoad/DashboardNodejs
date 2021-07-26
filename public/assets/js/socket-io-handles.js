const indexToKeyMap = {
    0: 'id',
    1: 'vehicleType',
    2: 'type',
    3: 'dayOfWeek',
    4: 'hour',
    5: 'dayType'
}

const initVehiclesFromTable = () => {
    const table = $('#all-table tbody')[0];
    var vehicles = [...table.rows].map(row => {
        const obj = {};

        [...row.cells].forEach((cell, index) => {
            const key = indexToKeyMap[index];
            if (key === 'vehicleType')
                obj[key] = $(cell).data('vehicle-type');
            else
                obj[key] = cell.innerText;
        });
        return obj;
    });
    return vehicles;
};

const handleVehiclesCounter = (socketData, vehicles) => {
    if (!vehicles.find(item => item.id == socketData.vehicleId)) {
        const counter = $(`#counter-${socketData.vehicleType}`)[0];
        $(`#counter-${socketData.vehicleType}`).html(parseInt(counter.innerText) + 1);
    }
}
const handleAllTableVehicles = (vehicle) => {
    appendTable(vehicle, 'all-table');
}
const handleVehicleTypeTable = (vehicle) => {
    appendTable(vehicle, `${vehicle.vehicleType}-vehicle-table`);
}
const appendTable = (vehicle, tableId) => {
    const vehicleRow = $(`#${tableId} tbody #tr-${vehicle.vehicleId}`)[0];
    const type = window.VEHICLES_TYPES[vehicle.vehicleType] || window.VEHICLES_TYPES['default'];
    const icon = type.icon;
    if (vehicleRow) {
        Object.keys(indexToKeyMap).forEach((index) => {
            const key = indexToKeyMap[index];
            if (key === 'vehicleType')
                $(vehicleRow).find("td").eq(index).html(`<i class="material-icons">${icon}</i>`);
            else {
                $(vehicleRow).find("td").eq(index).html(vehicle[key]?.capitalize());
            }
        });
    }
    else {
        $(`#${tableId} tbody`).append(`<tr id="tr-${vehicle.vehicleId}">
        <td>${vehicle.vehicleId}</td>
        <td data-vehicle-type=${vehicle.vehicleType}"><i class="material-icons">${icon}</i></td>
        <td>${vehicle.type.capitalize()}</td>
        <td>${vehicle.dayOfWeek}</td>
        <td>${vehicle.hour}</td>
        <td>${vehicle.dayType.capitalize()}</td>
        </tr>`);
    }
}