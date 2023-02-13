{ pkgs, lib, ... }:

{
  languages.javascript.enable = lib.mkDefault true;
  languages.javascript.package = lib.mkDefault pkgs.nodejs-16_x;
}
