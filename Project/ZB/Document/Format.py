def clean_text(input_text):
    """
    去掉所有空行，并将 '\(', '\[', '\)', '\]' 替换为 '$'
    之后将 '$$' 替换为 '$'
    """
    # 分割成行，并去掉空行
    lines = input_text.splitlines()
    non_empty_lines = [line for line in lines if line.strip() != '']
    
    # 将 '\(', '\[', '\)', '\]' 替换为 '$'，并将 '$$' 替换为 '$'
    result = []
    for line in non_empty_lines:
        modified_line = (line.replace(r'\(', '$')
                             .replace(r'\[', '$')
                             .replace(r'\)', '$')
                             .replace(r'\]', '$'))
        
        # 替换 "$$" 为 "$"
        modified_line = modified_line.replace('$$', '$')
        
        result.append(modified_line)
    
    # 将结果重新合并为字符串
    return '\n'.join(result)

def process_file(input_file, output_file):
    """
    从 input_file 读取内容，处理后写入 output_file
    """
    # 读取文件内容
    with open(input_file, 'r', encoding='utf-8') as file:
        input_text = file.read()
    
    # 处理文本
    cleaned_text = clean_text(input_text)
    
    # 将处理后的文本写入新的文件
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(cleaned_text)

# 示例用法
input_file = 'input.txt'
output_file = 'output.txt'
process_file(input_file, output_file)
