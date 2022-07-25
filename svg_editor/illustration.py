import bs4
import yaml
from bs4 import BeautifulSoup


def __no_navigable_string(iterator):
    return filter(lambda element: not isinstance(element, bs4.element.NavigableString), iterator)


def __todict(parsed):
    if parsed.name == '[document]':
        illustration = {}
        for child in __no_navigable_string(parsed.children):
            illustration['attributes'] = []
            for attr in __no_navigable_string(child.attrs):
                illustration['attributes'].append({attr: child.attrs[attr]})
            illustration['layers'] = []
            for layer in __no_navigable_string(child):
                illustration['layers'].append(__todict(layer))
        return illustration
    else:
        tag = {'attributes': []}
        for attr in __no_navigable_string(parsed.attrs):
            tag['attributes'].append({attr: parsed.attrs[attr]})
        tag['outers'] = []
        for child in __no_navigable_string(parsed.children):
            tag['outers'].append(__todict(child))
        if parsed.name == 'g':
            return tag
        else:
            return {parsed.name: tag}


def dump(svg, stream=None):
    parsed_svg = BeautifulSoup(svg)
    svg_dict = __todict(parsed_svg)
    if stream:
        yaml.dump(svg_dict, stream=stream)
    else:
        return svg_dict

