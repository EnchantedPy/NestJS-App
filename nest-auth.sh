#!/bin/sh

ProgName=$(basename $0)
HOST=""
PORT=3000
URL="http://$HOST:$PORT/"

check_args_count() {
    local expected=$1
    local actual=$2

    if [ "$actual" -ne "$expected" ]; then
        echo "Error: expected $expected arguments, got $actual" >&2
        echo "Run '$ProgName --help' for usage." >&2
        exit 1
    fi
}



sub_help() {
    cat <<EOF
Usage: $ProgName <subcommand> [arguments]

Available subcommands:

  healthcheck

  register <login> <passwd>

  loginusr <login> <passwd>

  admlogin <login> <passwd> <unique>

  logout <session_id>

  delete <session_id> <login>

  list <uuid>

Common errors:
  - Incorrect number of arguments
  - Unknown subcommand

Help page:
  $ProgName help        Shows this thing

EOF
}


sub_healthcheck() {
        check_args_count 0 "$#"
        res=$(curl URL)
        echo "$res"
        return 0
}

sub_register() {
        check_args_count 2 "$#"
        local login=$1
        local passwd=$2

        if [ -z "$login" ] || [ -z "$passwd" ]; then
                echo "Usage: $ProgName login <login> <passwd>"
                exit 1
        fi

        json=$(printf '{"login":"%s","passwd":"%s"}' "$login" "$passwd")

        res=$(curl -X POST -H "Content-Type: application/json" -d "$json" "${URL}register")
        echo "$res"
        return 0
}

sub_loginusr() {
        check_args_count 2 "$#"
        local login=$1
        local passwd=$2
        json=$(printf '{"login":"%s","passwd":"%s"}' "$login" "$passwd")

        res=$(curl -X POST -H "Content-Type: application/json" -d "$json" "${URL}login/user")
        echo "$res"
        return 0
}

sub_logout() {
        check_args_count 1 "$#"
        local session_id=$1
        json=$(printf '{"session_identifier":"%s"}' "$session_id")
        res=$(curl -X POST -H "Content-Type: application/json" -d "$json" "${URL}logout")
        echo "$res"
        return 0
}

sub_delete() {
        check_args_count 2 "$#"
        local session_id=$1
        local login=$2
        json=$(printf '{"session_identifier":"%s","login":"%s"}' "$session_id" "$login")
        res=$(curl -X DELETE -H "Content-Type: application/json" -d "$json" "${URL}delete")
        echo "$res"
        return 0
}

sub_admlogin() {
        check_args_count 3 "$#"
        local login=$1
        local passwd=$2
        local unique=$3
        json=$(printf '{"login": "%s", "passwd": "%s", "unique": "%s"}' "$login" "$passwd" "$unique")
        res=$(curl -X POST -H "Content-Type: application/json" -d "$json" "${URL}login/admin")
        echo "$res"
        return 0
}

sub_list() {
        check_args_count 1 "$#"
        local uuid=$1
        json=$(printf '{"uuid": "%s"}' "$uuid")
        res=$(curl -X POST -H "Content-Type: application/json" -d "$json" "${URL}list")
        echo "$res"
        return 0
}

subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        sub_help
        ;;
 *)
        shift
        sub_${subcommand} $@
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "       Run '$ProgName --help' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac