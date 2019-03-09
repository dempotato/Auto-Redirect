module.exports = function AutoRedirect(mod) {
	
	const Vec3 = require('tera-vec3')
	
	let {
		enabled,
		notifications,
		dungeonZoneLoc
	} = require('./config.json')
	
	let myZone = null
	
	mod.command.add('尾王', () => {
		enabled = !enabled
		sendMessage('模块 ' + (enabled ? BLU('开启') : YEL('关闭')))
	})
	
	mod.hook('S_LOAD_TOPO', 3, (event) => {
		myZone = event.zone
		
		if (myZone === 9714) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {})
		}
	})
	
	mod.hook('S_SPAWN_ME', 3, (event) => {
		let dungeon
		if (enabled && (dungeon = dungeonZoneLoc.filter(d => d.zone === myZone)[0])) {
			if (notifications) {
				sendMessage('已传送至 ' + TIP(dungeon.name))
			}
			
			event.loc = new Vec3(dungeon.loc)
			event.w = Math.PI / dungeon.w
			
			mod.send('C_PLAYER_LOCATION', 5, event)
			return true
		}
	})
	
	function sendMessage(msg) {
		mod.command.message(msg)
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
