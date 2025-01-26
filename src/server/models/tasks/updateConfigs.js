import dbManager from '../../database/db_manager.js';

export async function updateConfigTimes(name) {
  const records = await dbManager.selectAll("configs", { name: name })
  if (records && records.length > 0) {
    const res = records[0]
    const no = Number(res.val) + 1
    await dbManager.update("configs", { val: String(no) }, { id: res.id })
  } else {
    await dbManager.insert("configs", { name: name, val: "1" })
  }
}