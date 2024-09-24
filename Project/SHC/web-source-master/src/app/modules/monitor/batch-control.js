/*global angular*/
'use strict';
angular.module('app').constant('monitorBatchControl', {
    turnOn: {
        entity: {
            status: {
                switch: 'EMC_ON'
            }
        }
    },
    turnOff: {
        entity: {
            status: {
                switch: 'EMC_OFF'
            }
        }
    },
    on: {
        entity: {
            status: {
                valve: 'EMC_ON'
            }
        }
    },
    off: {
        entity: {
            status: {
                valve: 'EMC_OFF'
            }
        }
    },
    cool: {
        entity: {
            status: {
                mode: 'EMC_COOLING'
            }
        }
    },
    heat: {
        entity: {
            status: {
                mode: 'EMC_HEATING'
            }
        }
    },
    send: {
        entity: {
            status: {
                mode: 'EMC_HEATING'
            }
        }
    },
    temperature: {
        entity: {
            status: {
                temperature: 16
            }
        }
    },
    windspeed: {
        entity: {
            status: {
                windspeed: ''
            }
        }
    },
    mode: {
        entity: {
            status: {
                mode: ''
            }
        }
    }
});