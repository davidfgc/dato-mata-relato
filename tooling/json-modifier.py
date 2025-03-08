import json
import argparse
from collections import defaultdict

def delete_field(json_file_path, field_to_delete, output_file_path=None):
    """
    Delete a specified field from all objects in a JSON array.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        field_to_delete (str): Name of the field to delete
        output_file_path (str, optional): Path where the modified JSON will be saved.
                                         Defaults to overwriting the input file.
    
    Returns:
        list: The modified JSON array
    """
    # Set default output path if not provided
    if output_file_path is None:
        output_file_path = json_file_path
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Delete the specified field from each object
    for item in data:
        if field_to_delete in item:
            del item[field_to_delete]
    
    # Write the modified data back to the file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
    
    return data

def rename_field(json_file_path, old_field_name, new_field_name, output_file_path=None):
    """
    Rename a specified field in all objects in a JSON array.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        old_field_name (str): Current name of the field
        new_field_name (str): New name for the field
        output_file_path (str, optional): Path where the modified JSON will be saved.
                                         Defaults to overwriting the input file.
    
    Returns:
        list: The modified JSON array
    """
    # Set default output path if not provided
    if output_file_path is None:
        output_file_path = json_file_path
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Rename the specified field in each object
    for item in data:
        if old_field_name in item:
            item[new_field_name] = item.pop(old_field_name)
    
    # Write the modified data back to the file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
    
    return data

def add_field(json_file_path, new_field_name, value, output_file_path=None):
    """
    Add a new field with a specified value to all objects in a JSON array.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        new_field_name (str): Name of the field to add
        value: Value to assign to the new field (can be any valid JSON value)
        output_file_path (str, optional): Path where the modified JSON will be saved.
                                         Defaults to overwriting the input file.
    
    Returns:
        list: The modified JSON array
    """
    # Set default output path if not provided
    if output_file_path is None:
        output_file_path = json_file_path
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Add the new field to each object
    for item in data:
        item[new_field_name] = value
    
    # Write the modified data back to the file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
    
    return data

def extract_range(json_file_path, start_index, end_index, output_file_path):
    """
    Extract objects from position x to position y from a JSON array and save them to a new file.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        start_index (int): Starting position (0-based index)
        end_index (int): Ending position (0-based index, inclusive)
        output_file_path (str): Path where the extracted objects will be saved
    
    Returns:
        list: The extracted JSON array
    """
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Validate indices
    if start_index < 0:
        start_index = 0
    if end_index >= len(data):
        end_index = len(data) - 1
    if start_index > end_index:
        start_index, end_index = end_index, start_index
    
    # Extract the objects within the specified range (inclusive of end_index)
    extracted_data = data[start_index:end_index + 1]
    
    # Write the extracted data to the output file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(extracted_data, file, ensure_ascii=False, indent=2)
    
    return extracted_data

def extract_ids(json_file_path, output_file_path=None):
    """
    Extract all 'id' values from objects in a JSON array and save them to a file.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        output_file_path (str, optional): Path where the extracted IDs will be saved.
                                         If None, the IDs are only returned, not saved.
    
    Returns:
        list: List of extracted IDs
    """
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Extract all IDs
    ids = [item.get('id') for item in data if 'id' in item]
    
    # Write the extracted IDs to the output file if specified
    if output_file_path:
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(ids, file, ensure_ascii=False, indent=2)
    
    return ids

def remove_by_ids(json_file_path, ids_to_remove, output_file_path=None):
    """
    Remove objects with specified IDs from a JSON array.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        ids_to_remove (list or str): List of IDs to remove, or path to a JSON file containing IDs
        output_file_path (str, optional): Path where the modified JSON will be saved.
                                         Defaults to overwriting the input file.
    
    Returns:
        tuple: (filtered_data, items_removed)
    """
    # Set default output path if not provided
    if output_file_path is None:
        output_file_path = json_file_path
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Process ids_to_remove if it's a file path
    if isinstance(ids_to_remove, str):
        with open(ids_to_remove, 'r', encoding='utf-8') as file:
            ids_to_remove = json.load(file)
    
    # Convert ids_to_remove to a set for faster lookup
    ids_set = set(ids_to_remove)
    
    # Filter out objects with IDs in the remove list
    filtered_data = [item for item in data if item.get('id') not in ids_set]
    
    # Write the filtered data back to the file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(filtered_data, file, ensure_ascii=False, indent=2)
    
    # Return the number of items removed and the filtered data
    items_removed = len(data) - len(filtered_data)
    return filtered_data, items_removed

def count_objects(json_file_path):
    """
    Count the total number of objects in a JSON array.
    
    Args:
        json_file_path (str): Path to the JSON file to process
    
    Returns:
        int: The number of objects in the array
    """
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Return the count of objects
    return len(data)

def extract_field(json_file_path, field_name, output_file_path=None):
    """
    Extract the values of a specific field from all objects in a JSON array.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        field_name (str): Name of the field to extract
        output_file_path (str, optional): Path where the extracted values will be saved.
                                         If None, the values are only returned, not saved.
    
    Returns:
        list: List of extracted field values
    """
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Extract all values of the specified field
    field_values = [item.get(field_name) for item in data if field_name in item]
    field_values = sorted(field_values)
    
    # Write the extracted values to the output file if specified
    if output_file_path:
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(field_values, file, ensure_ascii=False, indent=2)
    
    return field_values

def keep_by_ids(json_file_path, ids_to_keep, output_file_path=None):
    """
    Keep only objects with specified IDs from a JSON array, removing all others.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        ids_to_keep (list or str): List of IDs to keep, or path to a JSON file containing IDs
        output_file_path (str, optional): Path where the modified JSON will be saved.
                                         Defaults to overwriting the input file.
    
    Returns:
        tuple: (filtered_data, items_kept)
    """
    # Set default output path if not provided
    if output_file_path is None:
        output_file_path = json_file_path
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Process ids_to_keep if it's a file path
    if isinstance(ids_to_keep, str):
        with open(ids_to_keep, 'r', encoding='utf-8') as file:
            ids_to_keep = json.load(file)
    
    # Convert ids_to_keep to a set for faster lookup
    ids_set = set(ids_to_keep)
    
    # Filter to keep only objects with IDs in the keep list
    filtered_data = [item for item in data if item.get('id') in ids_set]
    
    # Write the filtered data back to the file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(filtered_data, file, ensure_ascii=False, indent=2)
    
    # Return the filtered data and how many items were kept
    return filtered_data, len(filtered_data)

def find_duplicate_ids(json_file_path, output_file_path=None):
    """
    Find objects with duplicate IDs in a JSON array.
    
    Args:
        json_file_path (str): Path to the JSON file to process
        output_file_path (str, optional): Path where the duplicate objects will be saved.
                                         If None, only the result is returned, not saved.
    
    Returns:
        tuple: (duplicates_dict, count)
            duplicates_dict: Dictionary with IDs as keys and lists of duplicate objects as values
            count: Total number of duplicate objects found
    """
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Create a dictionary to store objects by ID
    id_dict = defaultdict(list)
    
    # Group objects by ID
    for index, item in enumerate(data):
        if 'id' in item:
            # Store both the item and its index in the original array
            id_dict[item['id']].append({'index': index, 'item': item})
    
    # Filter out IDs with only one occurrence
    duplicates = {id_val: items for id_val, items in id_dict.items() if len(items) > 1}
    
    # Count total duplicate objects
    duplicate_count = sum(len(items) for items in duplicates.values())
    
    # Write the duplicate objects to the output file if specified
    if output_file_path:
        # Format for output: list of duplicate objects with their original indices
        output_data = []
        for id_val, items in duplicates.items():
            output_data.append({
                'id': id_val,
                'count': len(items),
                'objects': [{'index': item['index'], 'data': item['item']} for item in items]
            })
        
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(output_data, file, ensure_ascii=False, indent=2)
    
    return duplicates, duplicate_count

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Modify and analyze JSON files')
    parser.add_argument('file', help='Path to the JSON file')
    parser.add_argument('--delete', help='Field to delete from all objects')
    parser.add_argument('--rename', nargs=2, metavar=('OLD', 'NEW'), help='Rename a field (provide old and new names)')
    parser.add_argument('--add', nargs=2, metavar=('FIELD', 'VALUE'), help='Add a new field with specified value to all objects')
    parser.add_argument('--extract-range', nargs=2, type=int, metavar=('START', 'END'), 
                        help='Extract objects from START to END positions (0-based, inclusive)')
    parser.add_argument('--extract-ids', action='store_true', help='Extract all ID values from objects')
    parser.add_argument('--extract-field', help='Extract values of a specific field from all objects')
    parser.add_argument('--remove-by-ids', help='Remove objects with IDs listed in this file')
    parser.add_argument('--keep-by-ids', help='Keep only objects with IDs listed in this file')
    parser.add_argument('--ids', nargs='+', help='List of IDs to remove/keep (use with --remove-by-ids or --keep-by-ids)')
    parser.add_argument('--count', action='store_true', help='Count the total number of objects in the file')
    parser.add_argument('--find-duplicates', action='store_true', help='Find objects with duplicate IDs')
    parser.add_argument('--output', help='Output file path (default: overwrite input file for modify operations)')
    
    args = parser.parse_args()

    # Count objects if requested (this doesn't modify the file)
    if args.count:
        count = count_objects(args.file)
        print(f"Total objects in {args.file}: {count}")
    
    # Find duplicate IDs if requested
    if args.find_duplicates:
        duplicates, duplicate_count = find_duplicate_ids(args.file, args.output)
        if duplicate_count > 0:
            print(f"Found {duplicate_count} objects with duplicate IDs ({len(duplicates)} unique IDs)")
            if args.output:
                print(f"Duplicate objects saved to '{args.output}'")
            else:
                # Print a summary of duplicates
                for id_val, items in duplicates.items():
                    print(f"ID '{id_val}' appears {len(items)} times at indices: {[item['index'] for item in items]}")
        else:
            print("No duplicate IDs found")
    
    # Handle other operations
    if args.delete:
        delete_field(args.file, args.delete, args.output)
        print(f"Deleted field '{args.delete}' from all objects")
    
    if args.rename:
        rename_field(args.file, args.rename[0], args.rename[1], args.output)
        print(f"Renamed field '{args.rename[0]}' to '{args.rename[1]}' in all objects")
    
    if args.add:
        # Try to interpret the value as JSON if possible, otherwise use as string
        value = args.add[1]
        try:
            value = json.loads(value)
        except json.JSONDecodeError:
            # Keep as string if not valid JSON
            pass
            
        add_field(args.file, args.add[0], value, args.output)
        print(f"Added field '{args.add[0]}' with value '{value}' to all objects")
    
    if args.extract_range:
        # For extract-range operation, output file is required
        if not args.output:
            parser.error("--extract-range requires --output to specify the output file path")
        
        start, end = args.extract_range
        extracted = extract_range(args.file, start, end, args.output)
        print(f"Extracted {len(extracted)} objects (from position {start} to {end}) to '{args.output}'")
    
    if args.extract_ids:
        # For extract-ids operation, output file is recommended
        ids = extract_ids(args.file, args.output)
        if args.output:
            print(f"Extracted {len(ids)} IDs to '{args.output}'")
        else:
            print("Extracted IDs:", ids)
    
    if args.extract_field:
        # For extract-field operation, output file is recommended
        field_values = extract_field(args.file, args.extract_field, args.output)
        if args.output:
            print(f"Extracted {len(field_values)} values of field '{args.extract_field}' to '{args.output}'")
        else:
            print(f"Extracted values of field '{args.extract_field}':", field_values)
    
    if args.remove_by_ids or (args.ids and not args.keep_by_ids):
        # For remove-by-ids operation, we can use a file list or command line IDs
        ids_source = args.remove_by_ids if args.remove_by_ids else args.ids
        filtered_data, items_removed = remove_by_ids(args.file, ids_source, args.output)
        
        if items_removed > 0:
            print(f"Removed {items_removed} objects with matching IDs, {len(filtered_data)} objects remaining")
        else:
            print("No objects were removed, no matching IDs found")
    
    if args.keep_by_ids or (args.ids and args.keep_by_ids):
        # For keep-by-ids operation, we can use a file list or command line IDs
        ids_source = args.keep_by_ids if args.keep_by_ids else args.ids
        filtered_data, items_kept = keep_by_ids(args.file, ids_source, args.output)
        
        if items_kept > 0:
            print(f"Kept {items_kept} objects with matching IDs, removed {count_objects(args.file) - items_kept} objects")
        else:
            print("No objects were kept, no matching IDs found")