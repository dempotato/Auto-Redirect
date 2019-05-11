module.exports = function AutoRedirect(mod) {
	const Message = require('../tera-message')
	const MSG = new Message(mod)
	
	if (mod.proxyAuthor !== 'caali') {
		const options = require('./module').options
		if (options) {
			const settingsVersion = options.settingsVersion
			if (settingsVersion) {
				mod.settings = require('./' + (options.settingsMigrator || 'settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
				mod.settings._version = settingsVersion
			}
		}
	}
	
	const Vec3 = require('tera-vec3')
	
	mod.command.add("尾王", () => {
		mod.settings.enabled = !mod.settings.enabled
		MSG.chat("Auto-Redirect " + (mod.settings.enabled ? MSG.BLU("开启") : MSG.YEL("关闭")))
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
				MSG.chat("已传送至 " + MSG.TIP(dungeon.name))
			}
			
			event.loc = new Vec3(dungeon.loc)
			event.w = Math.PI / dungeon.w
			
			mod.send('C_PLAYER_LOCATION', 5, event)
			return true
		}
	})
	
}
