{ pkgs, lib, ... }:

{
  languages.javascript.enable = lib.mkDefault true;
  languages.javascript.package = lib.mkDefault pkgs.nodejs-18_x;
}
