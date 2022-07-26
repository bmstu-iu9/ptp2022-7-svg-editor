import bs4
import yaml
from bs4 import BeautifulSoup


# Filtering all non-tag elements
def __no_navigable_string(iterator):
    return filter(lambda element: not isinstance(element, bs4.element.NavigableString), iterator)


# Converting svg to dictionary
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
        for child in parsed.children:
            if isinstance(child, bs4.element.NavigableString):
                if not child.isspace():
                    tag['outers'].append(str(child))
            else:
                tag['outers'].append(__todict(child))
        if parsed.name == 'svg':
            return tag
        else:
            return {parsed.name: tag}


# Converting svg to yml
def dump(svg, stream=None):
    parsed_svg = BeautifulSoup(svg.replace('\n', ''), 'html.parser')
    svg_dict = __todict(parsed_svg)
    if stream:
        yaml.dump(svg_dict, stream=stream,  encoding='UTF-8', allow_unicode=True)
    else:
        return svg_dict


# Load yml file as dict
def load(stream):
    return yaml.load(stream, Loader=yaml.Loader)


