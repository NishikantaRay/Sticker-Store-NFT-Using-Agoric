/*
 * Copyright (c) 2016-2020  Moddable Tech, Inc.
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

#include "commodettoPocoBlit.h"
#include "stddef.h"

#ifndef false
	#define false (0)
#endif

#define xsGetHostDataPoco(slot) ((void *)((char *)xsGetHostData(slot) - offsetof(PocoRecord, pixels)))
#define xsmcGetHostDataPoco(slot) ((void *)((char *)xsmcGetHostData(slot) - offsetof(PocoRecord, pixels)))

#define PocoDisableGC(poco) \
if (!(poco->flags & kPocoFlagGCDisabled)) {	\
	poco->flags |= kPocoFlagGCDisabled;	\
	xsEnableGarbageCollection(false);	\
}
