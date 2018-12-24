# Soundscape Ecology Analysis Software

## Design Documentation

### Installation
Install either [TeX Live](https://www.tug.org/texlive/) or [MiKTeX](https://miktex.org).

You may also need to install one or more of the following:
* `biber`
* `pygmentize` (via pip)
* `fvextra`

Make sure that these are accessible via the terminal.

### Compilation
To compile this LaTeX document, run the `docs-compile` script:
```
$ ./docs-compile
```
Once the script finishes, you can find the resulting PDF: `main.pdf`.

To clean the `docs` directory of all build artifacts, run the `docs-clean` script:
```
$ ./docs-clean
```
