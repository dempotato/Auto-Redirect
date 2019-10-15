module.exports = function AutoRedirect(mod) {
	const Vec3 = require('tera-vec3')
	
	mod.command.add("尾王", () => {
		mod.settings.enabled = !mod.settings.enabled
		sendMessage("Auto-Redirect: " + (mod.settings.enabled ? "On" : "Off"))
	})
	
	mod.game.me.on('change_zone', (zone, quick) => {
		if (zone === 9714) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {})
		}
	})
	
	mod.hook('S_SPAWN_ME', 3, (event) => {
		let dungeon
		if (mod.settings.enabled && (dungeon = mod.settings.dungeonZoneLoc.find(obj => obj.zone == mod.game.me.zone))) {
			if (mod.settings.notifications) {
				sendMessage("已传送至 " + dungeon.name)
			}
			
			event.loc = new Vec3(dungeon.loc)
			event.w = Math.PI / dungeon.w
			
			mod.send('C_PLAYER_LOCATION', 5, event)
			return true
		}
	})
	
	function sendMessage(msg) { mod.command.message(msg) }
}
