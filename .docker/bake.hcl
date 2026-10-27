# Build every target from the root of the repository, so the relative paths below resolve:
#   docker buildx bake --file .docker/bake.hcl <target>
# Without a target, bake builds the default group. The web:image task builds the web target.

group "default" {
    targets = ["web"]
}

variable "TAGS" {
    description = "The tags of each image, separated by commas, such as local,dev. The first tag is the version."
    default     = "local"

    validation {
        condition     = !contains([for tag in split(",", TAGS) : trimspace(tag)], "")
        error_message = "Separate the tags in TAGS by commas, and leave none of them empty."
    }
}

# Builds the web image for the platform of the builder and loads it into the local image store, which works with every
# image store that Docker offers.
target "web" {
    context    = "."
    dockerfile = ".docker/web/Dockerfile"

    tags   = image_tags("dndmapp/web")
    output = ["type=docker"]

    labels = merge(web_labels(), {
        "org.opencontainers.image.version" = image_version()
        "org.opencontainers.image.created" = timestamp()
    })
}

# docker/metadata-action writes a bake file that defines this target with the tags and labels it computes for a
# workflow run. Locally it stays empty, so the targets that inherit it build without the action.
target "docker-metadata-action" {}

# Builds the web image in GitHub Actions, with the tags and labels of docker/metadata-action. Pass the bake files of
# the action after this one, so its definition of docker-metadata-action replaces the empty one above. Its tags replace
# those of web, and its labels override those of web with the same key.
target "web-gha" {
    inherits = ["web", "docker-metadata-action"]

    # The push input of docker/bake-action turns the docker output of web into a push to the registry. Without it, the
    # image store must be the containerd one to hold the image for both platforms and its attestations.
    platforms = ["linux/amd64", "linux/arm64"]

    # docker/metadata-action labels the image after the GitHub repository, so restore the labels that describe the web
    # image. Its version, created, and revision labels stay.
    labels = web_labels()

    # Record how the image was built and which packages it holds, and push both with the image.
    attest = [
        "type=provenance,mode=max",
        "type=sbom",
    ]

    # Cache every layer in the GitHub Actions cache, under a scope of its own per target. docker/bake-action hands
    # buildx the token that the cache needs.
    cache-from = ["type=gha,scope=web"]
    cache-to   = ["type=gha,scope=web,mode=max"]
}

# The labels that describe the web image, whichever target builds it.
function "web_labels" {
    params = []
    result = {
        "maintainer"                           = "D&D Mapp"
        "org.opencontainers.image.title"       = "D&D Mapp web"
        "org.opencontainers.image.description" = "The web client of D&D Mapp."
        "org.opencontainers.image.licenses"    = "MIT"
        "org.opencontainers.image.source"      = "https://github.com/dnd-mapp/dnd-mapp"
        "org.opencontainers.image.url"         = "https://github.com/dnd-mapp/dnd-mapp"
    }
}

# Every target tags its image with each tag in TAGS.
function "image_tags" {
    params = [image]
    result = [for tag in split(",", TAGS) : "${image}:${trimspace(tag)}"]
}

# The first tag in TAGS is the version, for the version label of each image.
function "image_version" {
    params = []
    result = trimspace(split(",", TAGS)[0])
}
