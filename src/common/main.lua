local json = require(".common.json")
local weavedrive = require(".common.weavedrive")
local main = {}

main.init = function()
	Owner = Owner or ao.env.Process.Owner
	Name = Name or "Fancy ass weave drive example"

	Handlers.add("info", Handlers.utils.hasMatchingTag("Action", "Info"), function(msg)
		ao.send({
			Target = msg.From,
			Name = Name,
			Owner = Owner,
			Data = json.encode({
				Name = Name,
				Owner = Owner,
			}),
		})
	end)

	Handlers.add("getTx", Handlers.utils.hasMatchingTag("Action", "Get-Tx"), function(msg)
		local txId = msg.Tags["Tx-Id"]
		assert(type(txId) == "string", "no transactionId provided")
		local tx = weavedrive.getTx(ao.id)
		if not tx then
			print("unable to retrieve tx")
		end
		print(json.encode(tx))
		ao.send({
			Target = msg.From,
			Data = json.encode({
				Transaction = tx,
			}),
		})
	end)
end

return main
