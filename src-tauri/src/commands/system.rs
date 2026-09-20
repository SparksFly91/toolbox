use tauri_helper::auto_collect_command;

#[tauri::command]
#[auto_collect_command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}