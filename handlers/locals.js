const _ = require("lodash");
module.exports = {
    SECTIONS: {
        1: {
            icon: 'looks_one'
        },
        2: {
            icon: 'looks_two'
        },
        3: {
            icon: 'looks_3'
        },
        4: {
            icon: 'looks_4'
        },
        5: {
            icon: 'looks_5'
        },
    },
    VEHICLES_TYPES: {
        private: {
            color: 'warning',
            text: 'Private',
            icon: 'directions_car',
            colorHex: '#ffa726'
        },
        van: {
            color: 'success',
            text: 'Van',
            icon: 'airport_shuttle',
            colorHex: '#66bb6a'
        },
        truck: {
            color: 'danger',
            text: 'Truck',
            icon: 'local_shipping',
            colorHex: '#ef5350',
        },
        default: {
            color: 'primary',
            text: 'Vehicle',
            icon: 'taxi_alert',
            colorHex: '#9c27b0',
        }
    },
    capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    _
};