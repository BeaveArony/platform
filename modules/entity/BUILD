load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "entity",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@redux/entity",
    visibility = ["//visibility:public"],
    deps = [
        "//modules/store",
    ],
)
