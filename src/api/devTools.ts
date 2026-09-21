import { invoke } from "@tauri-apps/api/core"
import { ApiResponse } from "@/types/global"

const DevToolsApi = {
  /**
   * 进制转换
   * @param from_base 从进制
   * @param to_base 到进制
   * @param value 要转换的值
   * @returns 转换后的值
   */
  baseConverter: async (fromBase: number, toBase: number, value: string) => {
    return await invoke<ApiResponse<string>>("base_converter", { fromBase, toBase, value })
  },
}

export default DevToolsApi
