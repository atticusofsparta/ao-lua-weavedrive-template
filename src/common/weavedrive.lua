--[[
  WeaveDrive Client

]]
local json = require(".common.json")
local drive = { _version = "0.0.1" }

function drive.getBlock(height)
	local block = io.open("/block/" .. height)
	if not block then
		return nil, "Block Header not found!"
	end
	local headers = json.decode(block:read(block:seek("end")))
	block:close()
	return headers
end

function drive.getTx(txId)
	local file = io.open("/tx/" .. txId)
	if not file then
		return nil, "File not found!"
	end
	local contents = json.decode(file:read(file:seek("end")))
	file:close()
	return contents
end

return drive
