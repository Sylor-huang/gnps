import dbManager from '../../database/db_manager.js';
import { formatLocalTime } from "../../database/format.js";

export async function main() {
  const uuid = "697f91fa-afc7-4805-84fc-02a23b42526e"
  const tasks = await dbManager.selectAll("tasks", { uuid: uuid })
  const t = tasks[0]
  const params = {
    status: "Done",
    completed_date: formatLocalTime(),
    result_files: JSON.stringify({
      name: "2A-B_quant_result",
      size: "10MB"
    })
  }
  await dbManager.update("tasks", params, { id: t.id })
}

main()
