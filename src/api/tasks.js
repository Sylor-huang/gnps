import requestReq from '@/utils/axiosReq'

export function getTasks(data) {
  return requestReq({
    url: '/api/tasks',
    method: 'get',
    data
  })
}

export function createTask(data) {
  return requestReq({
    url: '/api/create_task',
    method: 'post',
    data
  })
}

export function uploadFiles(data) {
  return requestReq({
    url: '/api/upload_files',
    isUploadFile: true,
    method: 'post',
    data
  })
}

export function updateTask(data) {
  return requestReq({
    url: '/api/update_task',
    method: 'post',
    data
  })
}

export function deleteTask(data) {
  return requestReq({
    url: '/api/delete_task',
    method: 'post',
    data
  })
}

export function getTaskResult(data) {
  return requestReq({
    url: '/api/result_file',
    method: 'get',
    timeout: 300000, // 5 分钟的超时
    data
  })
}

export function getGrapmlFiles(data) {
  return requestReq({
    url: '/api/graphml_files',
    method: 'get',
    timeout: 300000, // 5 分钟的超时
    data
  })
}

export function downloadZipResult(data) {
  return requestReq({
    url: '/api/download_result',
    method: 'get',
    timeout: 300000, // 5 分钟的超时
    isDownLoadFile: true,
    data
  })
}