/*
 * Copyright (c) 2016-2021  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK Runtime.
 * 
 *   The Moddable SDK Runtime is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 * 
 *   The Moddable SDK Runtime is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 * 
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with the Moddable SDK Runtime.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
/*
	Adafruit LIS3DH Accelerometer breakout
		https://www.adafruit.com/product/2809
	Implementation based on Adafruit https://github.com/adafruit/Adafruit_LIS3DH

	Datasheet: https://www.st.com/resource/en/datasheet/lis3dh.pdf

*/

import Timer from "timer";

function asHex(v) { return `${v.toString(16).padStart(2, "0")}`; }

const Register = Object.freeze({
	STATUS1: 0x07,
	OUTADC1_L: 0x08,
	OUTADC1_H: 0x09,
	OUTADC2_L: 0x0A,
	OUTADC2_H: 0x0B,
	OUTADC3_L: 0x0C,
	OUTADC3_H: 0x0D,
	INTCOUNT: 0x0E,
	WHOAMI: 0x0F,
	TEMPCFG: 0x1F,
	CTRL1: 0x20,
	CTRL2: 0x21,
	CTRL3: 0x22,
	CTRL4: 0x23,
	CTRL5: 0x24,
	CTRL6: 0x25,
	REFERENCE: 0x26,
	STATUS2: 0x27,
	OUT_X_L: 0x28,
	OUT_X_H: 0x29,
	OUT_Y_L: 0x2A,
	OUT_Y_H: 0x2B,
	OUT_Z_L: 0x2C,
	OUT_Z_H: 0x2D,
	FIFOCTRL: 0x2E,
	FIFOSRC: 0x2F,
	INT1CFG: 0x30,
	INT1SRC: 0x31,
	INT1THS: 0x32,
	INT1DUR: 0x33,
	CLICKCFG: 0x38,
	CLICKSRC: 0x39,
	CLICKTHS: 0x3A,
	TIMELIMIT: 0x3B,
	TIMELATENCY: 0x3C,
	TIMEWINDOW: 0x3D,
	ACTTHS: 0x3E,
	ACTDUR: 0x3F
});

const Config = Object.freeze({
	Range: {
		RANGE_16_G: 0b11,	// +/- 16g
		RANGE_8_G: 0b10,	// +/- 8g
		RANGE_4_G: 0b01,	// +/- 4g
		RANGE_2_G: 0b00		// +/- 2g (default value)
	},
	DataRate: {	 	// register 0x2A (LIS3DH_REG_CTRL_REG1) to set bandwidth
		DATARATE_400_HZ: 0b0111,	//  400Hz 
		DATARATE_200_HZ: 0b0110,	//  200Hz
		DATARATE_100_HZ: 0b0101,	//  100Hz
		DATARATE_50_HZ: 0b0100,		//   50Hz
		DATARATE_25_HZ: 0b0011,		//   25Hz
		DATARATE_10_HZ: 0b0010,		// 10 Hz
		DATARATE_1_HZ: 0b0001,		// 1 Hz
		POWERDOWN: 0,
		LOWPOWER_1K6HZ: 0b1000,
		LOWPOWER_5KHZ: 0b1001,
	},
	Features: {
		DISABLE:		0,
		ENABLE_X:		0b0001,
		ENABLE_Y:		0b0010,
		ENABLE_Z:		0b0100,
		ENABLE_TEMP:	0b0100_0000,
		ENABLE_ADC:		0b1000_0000,
	},
	Interrupt: {
		ACTIVE_HIGH:	0,
		ACTIVE_LOW:		0b0010	
	},
	Alert: {
		MOVEMENT:	1
	}
}, true);

const Gconversion = 9.80665;

class LIS3DH {
	#io;
	#onAlert;
	#monitor;
	#values = new Int16Array(3);
	#multiplier = (1 / 16380) * Gconversion;
	#rate = Config.DataRate.DATARATE_400_HZ;
	#range = Config.Range.RANGE_4_G;
	#accelEnabled = Config.Features.ENABLE_X | Config.Features.ENABLE_Y | Config.Features.ENABLE_Z;
	#lowPower = 0;

	constructor(options) {
		const io = this.#io = new options.sensor.io({
			hz: 100_000,
			address: 0x18,
			...options.sensor
		});

		if (0x33 !== io.readByte(Register.WHOAMI))
			throw new Error("unexpected sensor");

		const {alert, onAlert} = options;
		if (alert && onAlert) {
			this.#onAlert = options.onAlert;
			this.#monitor = new alert.io({
				mode: alert.io.InputPullUp,
				...alert,
				edge: alert.io.Falling,
				onReadable: () => this.#onAlert()
			});
			io.writeByte(Register.CTRL6, Config.Interrupt.ACTIVE_LOW);
        }

		this.configure({});
	}

	configure(options) {
		const io = this.#io;

		if (undefined !== options.rate)
			this.#rate = parseInt(options.rate);

		if (undefined !== options.range)
			this.#range = parseInt(options.range);

		if (undefined !== options.enable)
			this.#accelEnabled = options.enable & 0b111;

		if (undefined !== options.lowPower)
			this.#lowPower = options.lowPower ? 0b1000 : 0;

		// CTRL1 - Enable axes, normal mode @ rate
		io.writeByte(Register.CTRL1, this.#accelEnabled | this.#lowPower | (this.#rate << 4));

		// CTRL4 - Full Scale, Block data update, big endian, High res
		io.writeByte(Register.CTRL4, 0x88 | (this.#range << 4));

		if (undefined !== options.alert) {
			const alert = options.alert;

			if (undefined !== alert.mode) {
				if (alert.mode === Config.Alert.MOVEMENT) {
					io.writeByte(Register.CTRL2, 0b0000_0001);	// HP filter
					io.writeByte(Register.CTRL3, 0b0100_0000);
					io.writeByte(Register.CTRL5, 0b0000_1000);  // latch INT1
					io.writeByte(Register.INT1CFG, 0b0010_1010); // enable xh,yh,zh
				}
			}
			if (undefined !== alert.threshold)
				io.writeByte(Register.INT1THS, alert.threshold & 0x7F);

			if (undefined !== alert.duration)
				io.writeByte(Register.INT1DUR, alert.duration & 0x7F);
        }
		else {
			// CTRL2 - Filter
			io.writeByte(Register.CTRL2, 0);

			// CTRL3 - Interrupt1
			io.writeByte(Register.CTRL3, 0);
		}

		if (this.#range === Config.Range.RANGE_16_G)
			this.#multiplier = 1 / 1365; // different sensitivity at 16g
		else if (this.#range === Config.Range.RANGE_8_G)
			this.#multiplier = 1 / 4096;
		else if (this.#range === Config.Range.RANGE_4_G)
			this.#multiplier = 1 / 8190;
		else
			this.#multiplier = 1 / 16380;

		this.#multiplier *= Gconversion;
	}
	status() {
		return this.#io.readByte(Register.INT1SRC);
	}
	close() {
		this.#monitor?.close();
		this.#monitor = undefined;
		this.#io.close();
		this.#io = undefined;
	}
	sample() {
		const io = this.#io;
		const values = this.#values, multiplier = this.#multiplier;
		let ret = {};

		if (this.#accelEnabled) {
			io.readBlock(Register.OUT_X_L | 0x80, values);
			ret.x = values[0] * multiplier;
			ret.y = values[1] * multiplier;
			ret.z = values[2] * multiplier;
		}

		return ret;
	}
}
Object.freeze(LIS3DH.prototype);

export {LIS3DH as default, LIS3DH, Config};
