use tauri_helper::auto_collect_command;

use crate::services::models::ApiResponse;

#[tauri::command]
#[auto_collect_command]
pub fn base_converter(
    from_base: u32,
    to_base: u32,
    value: String,
) -> Result<ApiResponse<String>, String> {
    let num = i128::from_str_radix(value.trim(), from_base)
        .map_err(|e| format!("Invalid input: {}", e))?;
    let result = match to_base {
        2 => format!("{:b}", num),
        8 => format!("{:o}", num),
        10 => format!("{}", num),
        16 => format!("{:x}", num),
        _ => to_base_n(num, to_base as u32),
    };
    Ok(ApiResponse::<String>::success(result))
}

/// 通用进制转换 (2-36)
fn to_base_n(mut num: i128, base: u32) -> String {
    if num == 0 {
        return "0".to_string();
    }

    let is_negative = num < 0;
    if is_negative {
        num = -num;
    }

    let digits = b"0123456789abcdefghijklmnopqrstuvwxyz";
    let mut result = Vec::new();

    while num > 0 {
        result.push(digits[(num % base as i128) as usize]);
        num /= base as i128;
    }

    if is_negative {
        result.push(b'-');
    }
    result.reverse();
    String::from_utf8(result).unwrap()
}
