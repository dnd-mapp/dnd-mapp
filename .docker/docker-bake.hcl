variable "TAGS" {
    default = ["latest"]
}

group "default" {
    targets = ["app"]
}

target "app" {
    context = "."
    dockerfile = ".docker/Dockerfile"
    platforms = [
        "linux/amd64",
        "linux/arm64",
        "linux/arm/v7"
    ]
    tags = [for tag in TAGS : "dndmapp/dnd-mapp:${tag}"]

    attest = [
        "type=sbom",
        "type=provenance,mode=max"
    ]
}
