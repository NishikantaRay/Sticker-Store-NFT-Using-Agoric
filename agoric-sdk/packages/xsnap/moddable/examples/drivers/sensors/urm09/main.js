/*
 * Copyright (c) 2021  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 * 
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>.
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA.
 *
 */

import device from "embedded:provider/builtin";
import { URM09, Config } from "embedded:sensor/Proximity-Temperature/URM09";
import Timer from "timer";

const sensor = new URM09({
	sensor: {
		...device.I2C.default,
		io: device.io.SMBus
	}
});

sensor.configure({
	mode: Config.ONE_SHOT,
	range: Config.RANGE_300CM
});
	
Timer.repeat(() => {
	const sample = sensor.sample();

	trace(`Distance: ${sample.near ? "NEAR" : ""}  ${sample.distance} cm, max: ${sample.max} -- Temperature ${sample.temperature} C\n`);
}, 2000);

