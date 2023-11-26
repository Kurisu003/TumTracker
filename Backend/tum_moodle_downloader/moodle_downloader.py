import json
import re
import firebase_admin
import tum_moodle_downloader.globals as globals
import tum_moodle_downloader.course_retrieval as course_retrieval
from firebase_admin import firestore

def push_subject_to_db(course_json, subject_short):

    cred = firebase_admin.credentials.Certificate('./tum-tracker-firebase-admin-key.json')
    app = firebase_admin.initialize_app(cred)
    db = firestore.client()
    ref = db.collection("worksheets").document(subject_short)
    ref.set(course_json)


def match_sheets_and_weeks(info, course_name):
    numbers_gu = [int(''.join(filter(str.isdigit, s))) for s in info[1] if any(char.isdigit() for char in s)]
    numbers_zu = [int(''.join(filter(str.isdigit, s))) for s in info[0] if any(char.isdigit() for char in s)]

    matched_sheets = {
        "GU":[],
        "ZU":[]
    }

    course_short = ""

    if "analysis" in course_name.lower():
        course_short = "An"
    elif "lin" in course_name.lower():
        course_short = "La"
    else:
        course_short = "unknown_"

    # Loop until the highest current worksheet
    max_number = max(numbers_gu + numbers_zu, default=None)
    for i in range(1,max_number+1):
        # get the first, second, third ... worksheet
        temp_zu = [s for s in info[0] if str(i) in s]
        temp_gu = [s for s in info[1] if str(i) in s]

        ## Gü Analysis & Lin alg
        if (len(temp_gu) > 0):
            matched_sheets["GU"].append(
                {"Id":course_short+"Gu"+str(i),
                "Week": info[2][i]}
            )
        else:
            matched_sheets["GU"].append(
                {"Id":course_short+"Gu"+str(i)+"_N/A",
                "Week": info[2][i]}
            )




        ## Zü unabängig ob La oder An
        if (len(temp_zu) > 0):
            matched_sheets["ZU"].append(
                {"Id":course_short+"Zu"+str(i),
                "Week":info[2][i-1]}
            )

        else:
            matched_sheets["ZU"].append(
                {"Id":course_short+"Zu"+str(i)+"_N/A",
                "Week":info[2][i-1]}
            )

    push_subject_to_db(matched_sheets, course_short)


def list_resources(args):
    try:
        course_name = args.course
        if course_name == "*":
            # List the names of all available courses
            course_retrieval.list_courses()
        else:
            # List all available resources within the specified course
            course = course_retrieval.get_course(course_name)
            if course is not None:
                if args.files:
                    course.list_all_files()
                else:
                    # info[0] -> Zu
                    # info[1] -> Gu
                    # info[2] -> Weeks

                    info = course.list_all_resources()
                    match_sheets_and_weeks(info, args.course)

    except Exception as e:
        print(f"Error listing resources: {e}")


def download(args):
    try:
        course_name = args.course
        resource_pattern = args.file_pattern
        destination_path = args.destination

        if destination_path is None:
            if resource_pattern is None:
                resource_pattern = ".*"
            if course_name is None:
                course_name = ".*"
            download_via_config(course_name, resource_pattern)
        else:
            course = course_retrieval.get_course(course_name)
            resource_names = course.get_matching_resource_names(resource_pattern)

            with open(globals.DOWNLOAD_CONFIG_PATH, mode='r', encoding='utf-8') as download_config_file:
                config_data = json.load(download_config_file)[0]
                parallel = config_data.get('parallel_downloads', bool)
                if parallel:
                    print("\u001B[33mParallel downloads active! This leads to unsorted download logging\u001B[0m")
            for resource_name in resource_names:
                course.download_resource(resource_name, destination_path, parallel, update_handling="update")
    except Exception as e:
        # TODO: add logging and log exception info (traceback) to a file
        print(f"Error downloading resources: {e}")


def download_via_config(req_course_name=".*", req_file_pattern=".*"):
    print("Downloading via download config")
    try:
        # TODO: check if requested file course name and requested file pattern exist in the config file
        req_course_name = re.compile(req_course_name)
        req_file_pattern = re.compile(req_file_pattern)

        with open(globals.DOWNLOAD_CONFIG_PATH, mode='r', encoding='utf-8') as download_config_file:
            download_config_data = json.load(download_config_file)[0]
            parallel = download_config_data.get('parallel_downloads', bool)
            if parallel:
                print("\u001B[33mParallel downloads active! This leads to unsorted download logging\u001B[0m")
        with open(globals.COURSE_CONFIG_PATH, mode='r', encoding='utf-8') as course_config_file:
            course_config_data = json.load(course_config_file)

        for course_config in course_config_data:
            course_name = course_config.get('course_name', None)
            if not re.match(req_course_name, course_name):
                continue

            # semester = course_config.get('semester', None)
            rules = course_config.get('rules', [])

            course = course_retrieval.get_course(course_name)
            if course is None:
                continue

            resource_names = course.get_matching_resource_names()
            for resource_name in resource_names:
                if not re.match(req_file_pattern, resource_name):
                    continue
                for rule in rules:
                    file_pattern = re.compile(rule.get('file_pattern', None))
                    if re.match(file_pattern, resource_name):
                        destination = rule.get('destination', None)
                        update_handling = rule.get('update_handling', "replace")
                        course.download_resource(resource_name, destination, parallel, update_handling)
                        break
        print("Done downloading via download config.")
    except Exception as e:
        # TODO: add logging and log exception info (traceback) to a file
        print(f"Error while downloading via config: {e}")
