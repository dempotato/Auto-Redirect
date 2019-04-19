module.exports = function AutoRedirect(mod) {
	const command = mod.command || mod.require.command;
	
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
		sendMessage("模块 " + (mod.settings.enabled ? BLU("开启") : YEL("关闭")))
	})
	
	mod.game.me.on('change_zone', (zone, quick) => {
		if (zone === 9714) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {
				
			})
		}
	})
	
	mod.hook('S_SPAWN_ME', 3, (event) => {
		let dungeon
		if (mod.settings.enabled && (dungeon = mod.settings.dungeonZoneLoc.find(obj => obj.zone === mod.game.me.zone))) {
			if (mod.settings.notifications) {
				sendMessage("已传送至 " + TIP(dungeon.name))
			}
			
			event.loc = new Vec3(dungeon.loc)
			event.w = Math.PI / dungeon.w
			
			mod.send('C_PLAYER_LOCATION', 5, event)
			return true
		}
	})
	
	function sendMessage(msg) {
		command.message(msg)
	}
	
	function BLU(bluetext) {
		return '<font color="#56B4E9">' + bluetext + '</font>'
	}
	
	function YEL(yellowtext) {
		return '<font color="#E69F00">' + yellowtext + '</font>'
	}
	
	function TIP(tipsText) {
		return '<font color="#00FFFF">' + tipsText + '</font>'
	}
	
}
